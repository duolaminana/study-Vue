<template>
  <div class="app-container customer-container">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <div>
          <el-form-item label="客户名称">
            <el-input v-model="postData.customerName" clearable placeholder="请输入客户名称" style="width: 200px" />
          </el-form-item>
          <el-form-item label="客户分类">
            <el-cascader
              style="width: 200px"
              v-model="searchSortName"
              :options="sortList"
              :props="{value: 'bid', label: 'sortName', children: 'children'}"
              filterable
              clearable
              placeholder="可搜索"
              change-on-select
              @change="getParentId1"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="会员等级">
            <el-select v-model="postData.memberBId" clearable placeholder="请选择等级" style="width: 200px">
              <el-option v-for="(item, index) in gradeList" :label="item.levelName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="postData.customerStatus" clearable style="width: 200px">
              <el-option v-for="(item, index) in areaList" :label="item.label" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="客户编码">
            <el-input v-model="postData.customerCode" clearable placeholder="请输入客户编码" style="width: 200px" />
          </el-form-item>
          <el-form-item label="国家" prop="countryCode">
            <el-select filterable remote :remote-method="getCountryList" :loading="loading1" v-model="postData.countryCode" clearable style="width: 200px">
              <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index">
                {{item.searchStr}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="postData.mobilePhone" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <!--<el-button type="primary" size="small" @click="openEdit('add')">新增</el-button>-->
      <!--<el-button type="primary" size="small" @click="deleteCustomer()">删除</el-button>-->
      <el-button type="primary" size="small" class="export" @click="exportExcel">导出</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="正在查询中。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column label="客户名称" prop="customerName" show-overflow-tooltip/>

      <el-table-column label="客户编码" prop="customerCode" show-overflow-tooltip/>

      <el-table-column label="国家" prop="cnCountryName" show-overflow-tooltip/>
      <el-table-column label="会员等级" prop="gradeName" show-overflow-tooltip />
      <el-table-column label="联系电话" prop="mobilePhone" align="center" show-overflow-tooltip />

      <!--<el-table-column label="分类" prop="sortName" show-overflow-tooltip />-->
      <el-table-column align="center" width="140px" label="修改人" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="100px" label="修改时间" prop="updateTime" show-overflow-tooltip >
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" :label="$t('system.role.status')" prop="accountStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.accountStatus === 0 ? 'primary' : 'danger' " size="mini">{{ scope.row.accountStatus
            === 0 ?
            $t('system.role.active') : $t('system.role.inactive') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="265" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="openDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="detailVisible" title="客户信息一览" width="1000px" center @close="clearDialog" destroy-on-close>
      <el-tabs v-model="activeName" :before-leave="changeTabs">
        <el-tab-pane label="客户档案" name="1">
          <el-form ref="customerData" :model="customerData" label-width="120px" inline label-position="right" size="small">
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="customerData.companyName" readonly placeholder="公司名称" class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item label="客户简称" prop="shortName">
              <el-input v-model="customerData.shortName" readonly placeholder="客户简称" class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item label="客户编码" prop="customerCode" >
              <el-input v-model="customerData.customerCode" readonly placeholder="客户编码" class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item label="国家" prop="countryCode" >
              <el-select
                v-model="customerData.countryCode"
                readonly
                filterable
                remote
                placeholder="请输入关键词"
                :remote-method="getCountryList"
                :loading="loading1"
                class="form-dialog-width"
                style="width: 600px"
              >
                <el-option v-for="(item, index) in countryList" :label="item.searchStr" :value="item.countryCode" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="注册地址" prop="registerAddress">
              <el-input v-model="customerData.registerAddress" readonly placeholder="注册地址" class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item label="办公地址" prop="officeAddress">
              <el-input v-model="customerData.officeAddress" readonly placeholder="办公地址" class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <!--<el-form-item label="其他地址" prop="otherAddress">-->
              <!--<el-input v-model="customerData.otherAddress" readonly placeholder="其他地址" class="form-dialog-width" style="width: 600px"/>-->
            <!--</el-form-item>-->
            <el-form-item label="邮政编码" prop="postalCode">
              <el-input v-model="customerData.postalCode" readonly placeholder="邮政编码" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>
            <el-form-item label="州/省地区" prop="provinceCode">
              <el-input v-model="customerData.provinceCode" readonly placeholder="州/省地区" class="form-dialog-width" style="width: 237px"/>
            </el-form-item>
            <el-form-item label="联系电话#1" prop="officePhone">
              <el-input v-model="customerData.officePhone" readonly placeholder="办公电话1" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>
            <el-form-item label="联系电话#2" prop="officePhone2">
              <el-input v-model="customerData.officePhone2" readonly placeholder="办公电话2" class="form-dialog-width" style="width: 237px"/>
            </el-form-item>
            <el-form-item label="移动电话1" prop="mobilePhone">
              <el-input v-model="customerData.mobilePhone" readonly placeholder="移动电话1" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item label="移动电话2" prop="mobilePhone2">
              <el-input v-model="customerData.mobilePhone2" readonly placeholder="移动电话2" class="form-dialog-width" style="width: 237px"/>
            </el-form-item>

            <el-form-item label="传真1" prop="facsimileNo">
              <el-input v-model="customerData.facsimileNo" readonly placeholder="传真1" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item label="传真2" prop="facsimileNo2">
              <el-input v-model="customerData.facsimileNo2" readonly placeholder="传真2" class="form-dialog-width" style="width: 237px"/>
            </el-form-item>

            <el-form-item label="邮箱" prop="emailAddress">
              <el-input v-model="customerData.emailAddress" readonly placeholder="Email" class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item label="Tax ID" prop="taxNo">
              <el-input v-model="customerData.taxNo" readonly placeholder="税号" class="form-dialog-width" style="width: 600px"/>
            </el-form-item>

            <el-form-item label="客户类别" prop="sortName">
              <el-cascader
                class="form-dialog-width"
                v-model="customerData.sortName"
                :options="sortList"
                :props="{value: 'bid', label: 'sortName', children: 'children'}"
                filterable
                disabled
                placeholder="可搜索"
                change-on-select
                @change="getParentId"
                style="width: 230px"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="会员等级" prop="memberBId">
              <el-select v-model="customerData.memberBId" readonly placeholder="请选择客户分类" class="form-dialog-width" style="width: 237px">
                <el-option v-for="(item, index) in gradeList" :label="item.levelName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="客户状态" prop="transaStatus">
              <el-radio-group v-model="customerData.transaStatus" style="width: 600px;">
                <el-radio :label="1">已成交</el-radio>
                <el-radio :label="2">未成交</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="客户来源" prop="customerSource">
              <el-radio-group v-model="customerData.customerSource" style="width: 600px;">
                <el-radio v-for="(item, index) in customerSourceList" :label="item.id" :key="index">{{item.label}}</el-radio>
                <!--                  <el-radio :label="1">自助开发</el-radio>-->
                <!--                  <el-radio :label="2">询盘</el-radio>-->
                <!--                  <el-radio :label="3">展会</el-radio>-->
              </el-radio-group>
            </el-form-item>
            <el-form-item label="所属区域" prop="ownFieldList">
              <el-checkbox-group v-model="customerData.ownFieldList" style="width: 600px;" @change="getownField">
                <el-checkbox v-for="(item, index) in ownFiledList" :label="item.label" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="保留字段1" prop="reservedField1">
              <el-input v-model="customerData.reservedField1" readonly placeholder="保留字段1" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item label="保留字段2" prop="reservedField2">
              <el-input v-model="customerData.reservedField2" readonly placeholder="保留字段2" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item label="保留字段3" prop="reservedField3">
              <el-input v-model="customerData.reservedField3" readonly placeholder="保留字段3" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item label="保留字段4" prop="reservedField4">
              <el-input v-model="customerData.reservedField4" readonly placeholder="保留字段4" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item label="保留字段5" prop="reservedField5">
              <el-input v-model="customerData.reservedField5" readonly placeholder="保留字段5" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item label="保留字段6" prop="reservedField6">
              <el-input v-model="customerData.reservedField6" readonly placeholder="保留字段6" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item label="保留字段7" prop="reservedField7">
              <el-input v-model="customerData.reservedField7" readonly placeholder="保留字段7" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item label="保留字段8" prop="reservedField8">
              <el-input v-model="customerData.reservedField8" readonly placeholder="保留字段8" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item label="保留字段9" prop="reservedField9">
              <el-input v-model="customerData.reservedField9" readonly placeholder="保留字段9" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item label="保留字段10" prop="reservedField10">
              <el-input v-model="customerData.reservedField10" readonly placeholder="保留字段10" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item label="状态" prop="customerStatus">
              <el-select v-model="customerData.customerStatus" readonly placeholder="请选择客户状态" class="form-dialog-width">
                <el-option v-for="(item, index) in statusList" :label="item.label" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--沟通记录-->
        <el-tab-pane label="沟通记录" name="2">
          <div>客服记录</div>
          <el-table
            style="margin: 10px 0"
            border
            fit
            size="small"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column label="账号" prop="bankAccount" show-overflow-tooltip >
            </el-table-column>

            <el-table-column label="联系电话" prop="bankName" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="公司" prop="bankAddress" show-overflow-tooltip>
            </el-table-column>

            <el-table-column align="center" label="开始时间" prop="reservedPhone" show-overflow-tooltip>
            </el-table-column>

            <el-table-column align="center" label="结束时间" prop="accountCurrency" show-overflow-tooltip >
            </el-table-column>

            <el-table-column align="center" label="操作" width="265" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export table-btn-width" @click="openDetail(scope.row.bid)">聊天记录</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div>线下沟通</div>
          <el-table
            style="margin: 10px 0"
            :data="recordList"
            border
            fit
            size="small"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column label="客户名称" prop="customerBId" show-overflow-tooltip >
              <template>
                {{customerName}}
              </template>
            </el-table-column>

            <el-table-column label="联系人" prop="contact" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="沟通主题" prop="commTheme" show-overflow-tooltip>
            </el-table-column>

            <el-table-column align="center" label="通讯模式" prop="commType" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.commType | commTypeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="沟通日期" prop="commTime" show-overflow-tooltip >
              <template slot-scope="scope">
                {{scope.row.commTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="265" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export table-btn-width" @click="openRecord(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:20px;text-align:right;cursor:pointer">
            <span @click="$router.push({path:'/customer/communication'})">更多>></span>
          </div>
        </el-tab-pane>
        <!--询价记录-->
        <el-tab-pane label="报价记录" name="3">
          <quoted :custom-bid="customBid" ref="reViewQuoted"></quoted>
        </el-tab-pane>
        <!--报价记录-->
        <el-tab-pane label="询价记录" name="4">
          <inquiry :custom-bid="customBid" ref="reViewInquiry">></inquiry>
        </el-tab-pane>
        <!--交易记录-->
        <el-tab-pane label="交易记录" name="5">
          <el-table
            v-loading="listLoading"
            :data="orderList"
            border
            fit
            size="mini"
            row-key="id"
            :header-cell-style="{background: '#a7bfee'}"
            @selection-change="getSelect">
            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column label="订单号" prop="orderNo" show-overflow-tooltip/>

            <el-table-column label="客户简称" prop="buyerShort" show-overflow-tooltip/>

            <el-table-column label="国家/电话" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.buyerCountryCode}}/{{scope.row.buyerTelephone}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="80" label="SKU数" prop="prodcutSkuCount" />

            <el-table-column align="center" label="金额" prop="totalAmount" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.totalAmount | moneyFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="100" label="创建人" prop="createUserName" show-overflow-tooltip/>

            <el-table-column align="center" width="150" label="订单日期" prop="createTime">
              <template slot-scope="scope">
                {{scope.row.createTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="80px" label="状态" prop="statusStr">
              <template slot-scope="scope">
                {{scope.row.statusStr}}
              </template>
            </el-table-column>

            <el-table-column header-align="center" label="操作" width="180" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export table-btn-width" @click="goRouter(scope.row.bid)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:20px;text-align:right;cursor:pointer">
            <span @click="$router.push({path:'/order/sale/saleOrder',query:{customerUserBid:customerBID}})">更多>></span>
          </div>
        </el-tab-pane>
        <!--收付款记录-->
        <el-tab-pane label="收付款记录" name="6">
          <div>收款记录</div>
          <div class="topBtns">
            <el-button type="primary" size="small" class="export" @click="exportExcel">导出</el-button>
          </div>
          <el-table
            v-loading="listLoading"
            :data="gatheringList"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}"
            @selection-change="getSelect">
            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>

            <el-table-column label="订单号" prop="orderNo" show-overflow-tooltip/>

            <el-table-column label="客户简称" prop="buyerShort" show-overflow-tooltip/>

            <el-table-column align="center" label="金额" prop="collectionAmount" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.collectionAmount | moneyFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="100" label="币种" prop="collectionCurrency" show-overflow-tooltip/>

            <el-table-column align="center" width="150" label="收到付款时间" prop="collectionTime">
              <template slot-scope="scope">
                {{scope.row.collectionTime | timeFmt}}
              </template>
            </el-table-column>

            <!--<el-table-column align="center" width="100" label="状态" prop="orderStatus">-->
            <!--<template slot-scope="{row}">-->
            <!--<el-tag :type="(row.orderStatus === 1) ? 'danger' : 'primary'" size="mini">{{row.orderStatus |-->
            <!--customStatusFmt}}-->
            <!--</el-tag>-->
            <!--</template>-->
            <!--</el-table-column>-->

            <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export table-btn-width" @click="goGathering(scope.row.bid)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:20px;text-align:right;cursor:pointer">
            <span @click="$router.push({path:'/settlementFinance/sale/paymentProof',query:{customerUserBid:customBid}})">更多>></span>
          </div>
          <div>付款记录</div>
          <div class="topBtns">
            <el-button type="primary" size="small" class="export" @click="exportExcel">导出</el-button>
          </div>
          <el-table
            v-loading="listLoading"
            :data="paymentList"
            border
            fit
            size="mini"
            row-key="id"
            :header-cell-style="{background: '#a7bfee'}"
            @selection-change="getSelect">
            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>
            <!--<el-table-column label="支付编号" prop="purchaseNo" show-overflow-tooltip/>-->
            <el-table-column label="订单编号" prop="orderNo" show-overflow-tooltip/>

            <el-table-column label="客户简称" prop="buyerShort" show-overflow-tooltip/>

            <el-table-column align="center" label="金额" prop="netTotalAmount" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.netTotalAmount | moneyFmt}}
              </template>
            </el-table-column>

            <el-table-column label="币种" width="100" prop="sellerName" show-overflow-tooltip/>

            <el-table-column align="center" width="150" label="收到付款时间" prop="orderCreateTime">
              <template slot-scope="scope">
                {{scope.row.orderCreateTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="left" label="操作" width="180" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export table-btn-width" @click="goPayment(scope.row.bid)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:20px;text-align:right;cursor:pointer">
            <span @click="$router.push({path:'/settlementFinance/payment/purchaseOrder',query:{customerBId:customBid}})">更多>></span>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailVisible=false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleDetail" title="客户沟通记录详情" center width="950px">
      <el-form ref="addCompany" :model="adsPosition" label-width="100px" label-position="right" size="small" >
        <el-form-item label="客户名称" prop="customerBId">
          <el-select v-model="adsPosition.customerBId" clearable style="width: 330px" disabled>
            <el-option v-for="(item, index) in clientList" :label="item.customerName" :value="item.bid" :key="index"></el-option>
          </el-select>
          <!--<el-input v-model="adsPosition.customerBId" clearable style="width: 330px"/>-->
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="adsPosition.contact" clearable style="width: 330px" readonly/>
        </el-form-item>
        <el-form-item label="沟通主题" prop="commTheme">
          <el-input v-model="adsPosition.commTheme" clearable style="width: 330px" readonly/>
        </el-form-item>
        <el-form-item label="参与者" prop="participantCustomerBId">
          <el-input v-model="adsPosition.participantCustomerBId" style="width: 330px" readonly/>
        </el-form-item>
        <el-form-item label="沟通日期" prop="commTime">
          <el-date-picker
            disabled
            v-model="adsPosition.commTime"
            type="datetime"
            style="width: 330px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="沟通场所" prop="commPlace">
          <el-input v-model="adsPosition.commPlace" clearable style="width: 773px" readonly/>
        </el-form-item>
        <el-form-item label="通讯模式" prop="commType">
          <el-radio-group v-model="adsPosition.commType" style="width: 330px" disabled>
            <el-radio :label="1">即时通讯</el-radio>
            <el-radio :label="2">邮件</el-radio>
            <el-radio :label="3">电话</el-radio>
            <el-radio :label="4">见面</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="沟通内容" prop="commRemarks">
          <!--<el-input v-model="adsPosition.commRemarks" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px"/>-->
          <tinymce v-model="adsPosition.commRemarks" style="width: 773px" readonly/>
        </el-form-item>
        <el-form-item label="沟通情况" prop="commSituation">
          <el-radio-group v-model="adsPosition.commSituation" style="width: 500px" disabled>
            <el-radio :label="1">很好</el-radio>
            <el-radio :label="2">好</el-radio>
            <el-radio :label="3">一般</el-radio>
            <el-radio :label="4">差</el-radio>
            <el-radio :label="5">非常差</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="行动计划" prop="commPlan">
          <!--<el-input v-model="adsPosition.commResult" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px"/>-->
          <tinymce v-model="adsPosition.commPlan" style="width: 773px" readonly/>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            disabled
            class="upload-demo"
            :action="uploadActionUrl"
          >
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table
        :data="filesList"
        border
        fit
        style="margin: 10px 0"
        size="small">
        <el-table-column label="附件名称" prop="filesName">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisibleDetail=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { pagephPaymentRecord } from '@/api/finance'
import {
  listCustomerInfo,
  // saveCustomerInfo,
  // updateCustomerInfo,
  getCustomerInfoByBId,
  listSort,
  exportCustomer,
  communicaList,
  listCustomerCommunicationApi,
  listCustomerInfoContactApi
} from '@/api/customer';
import { listMemberLevel } from '@/api/member'
import { getSaleOrderList, selectSalesCollectionRecord } from '@/api/order'
import { uploadActionUrl } from '@/api/common';
import { selectCountryListApi } from '@/api/system'
import { getClientUserList, getAdminUserList, selectUserListAllApi
} from '@/api/user'
import { getToken } from '@/utils/auth'
import { parseTime, deepClone } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
import inquiry from './inquiry'
import quoted from './quoted'
import Tinymce from '@/components/Tinymce'
export default {
  components: {
    Pagination,
    inquiry,
    quoted,
    Tinymce
  },
  mixins: [moneyFmt],
  data() {
    return {
      clientList: [],
      filesList: [],
      customerBID: '',
      gatheringList: [],
      financeList: [],
      customBid: '',
      customerBId: '',
      customerName: '',
      paymentList: [],
      collectionList: [],
      orderList: [],
      getOrderDataList: [],
      recordList: [],
      communicationList: [],
      currencyCodeList: [],
      uploadActionUrl,
      activeName: '1',
      dialogVisibleDetail: false,
      listLoading: true,
      confirmLoading: false,
      editVisible: false,
      detailVisible: false,
      addLinkVisible: false,
      selectLinkVisible: false,
      addServiceVisible: false,
      addBankVisible: false,
      loading1: false,
      Loading1: false,
      loading2: false,
      userLoading: false,
      checked1: false,
      checked2: false,
      dialogType: '',
      customerDataTemp: {},
      categoryForm: {
        gradientBId: ''
      },
      customerData: {
        customerStatus: 1,
        transaStatus: 0,
        ownField: '',
        ownFieldList: [],
        commLanguageList: [],
        commLanguage: '',
        customerName: '',
        shortName: '',
        customerCode: '',
        countryCode: '',
        memberBId: '',
        companyName: '',
        chargeBy: '',
        provinceCode: '',
        registerAddress: '',
        emailAddress: '',
        mobilePhone: '',
        facsimileNo: '',
        deliveryPort: '',
        deliveryPortArr: [],
        sortBId: '',
        gradeBId: '',
        sortName: [],
        customerSource: '',
        preferredLanguage: '',
        taxNo: '',
        facsimileNo2: '',
        mobilePhone2: '',
        officePhone: '',
        officePhone2: '',
        registerPhone: '',
        postalCode: '',
        otherAddress: '',
        officeAddress: '',
        remarks: '',
        reservedField1: '',
        reservedField2: '',
        reservedField3: '',
        reservedField4: '',
        reservedField5: '',
        reservedField6: '',
        reservedField7: '',
        reservedField8: '',
        reservedField9: '',
        reservedField10: ''
      },
      areaList: [
        {
          label: this.$t("system.userManage.inEmploy"),
          id: 0
        },
        {
          label: this.$t("system.userManage.inDisable"),
          id: 1
        }
      ],
      controlTowerList: [],
      spt: {
        paymentMethod: '',
        shipmentTypeArr: [],
        shipmentType: '',
        paymentType: '',
        sendPortBId: ''
      },
      scplist: [],
      sclist: [],
      sslist: [],
      categoryList: [],
      linkForm: {
        firstName: '',
        lastName: '',
        emailAddress: '',
        position: '',
        photoPath: '',
        usedLanguage: '',
        userAccount: '',
        contactAddress: '',
        userSex: 1,
        companyName: '',
        preferedLanguage: '',
        mobilePhone: '',
        mobilePhone2: '',
        officePhone: '',
        officePhone2: '',
        userType: 1,
        countryCode: '',
        preferedLanguageStr: []
      },
      serviceForm: {
        accountBId: '',
        accountName: '',
        csJob: '客服人员'
      },
      bankDialogType: 'add',
      bankSelectList: [],
      bankForm: {
        bankAccount: '',
        bankName: '',
        reservedPhone: '',
        swiftCode: '',
        branchName: '',
        bankAddress: '',
        accountCurrency: '',
        accountType: 1,
        defaultValue: 0
      },
      userListPrams: {
        pageSize: 10,
        total: 0,
        pageIndex: 1,
        searchKey: ''
      },
      selectLinkPeople: [],
      countryList: [],
      selectList: [],
      sortList: [],
      gradeList: [],
      linkList: [],
      accountUserList: [],
      accountUserListSelect: [],
      jobList: [],
      searchSortName: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        customerName: '',
        custSortBId: '',
        customerGradeId: '',
        memberBId: '',
        customerCode: '',
        countryCode: '',
        telephone: '',
        customerStatus: ''
      },
      // reviewForm: {
      //   idlist: '',
      //   customerStatus: 0
      // },
      languageList: [
        {
          id: '1',
          label: '英语'
        },
        {
          id: '2',
          label: '简体中文'
        },
        {
          id: '3',
          label: '繁体中文'
        }
      ],
      languageList1: [],
      ownFiledList: [
        {
          id: '1',
          label: 'IVD'
        },
        {
          id: '2',
          label: '耗材'
        },
        {
          id: '3',
          label: '实验室设备'
        },
        {
          id: '4',
          label: '护理与检测'
        }
      ],
      customerSourceList: [
        {
          id: "1",
          label: '自助开发'
        },
        {
          id: "2",
          label: '询盘'
        },
        {
          id: "3",
          label: '展会'
        }
      ],
      statusList: [
        {
          id: 1,
          label: '有效'
        },
        {
          id: 2,
          label: '无效'
        }
      ],
      customerStatusList: [
        {
          label: '启用',
          id: 1
        },
        {
          label: '禁用',
          id: 0
        }
      ],
      adminUserList: [],
      dataList: [],
      customerStatus: [],
      adsPosition: {
        contact: '',
        commTime: '',
        commTheme: '',
        commType: 1,
        commRemarks: '',
        commSituation: 1,
        commResult: '',
        bId: '',
        filesName: '',
        filesUrl: '',
        commBId: '',
        customerBId: '',
        commPlace: '',
        commPlan: '',
        participantCustomerBId: '',
        filesList: [],
        commBID: "",
        customeTime: ""
      },
      cooperObj: {
        cooperMode: '',
        rangeTime: '',
        beginTime: '',
        endTime: '',
        pactFile: '',
        pactFileUuid: '',
        pactFilePath: ''
      },
      fileList: [],
      firstPayment: false,
      upLoadHeaders: {
        token: getToken()
      }
    }
  },
  computed: {
    totalSum() {
      let val = 0;
      this.controlTowerList.forEach(e => {
        val += Number(e.paymentRatio)
      });
      return val
    }
  },
  created() {
    this.getDataList();
    this.getGradeList();
    this.getSortList();
    this.getUserAccountList();
    this.getCountryAllList();
  },
  methods: {
    goGathering(id) {
      this.$router.push({
        path: '/settlementFinance/sale/editPayRecord',
        query: {
          id
        }
      });
    },
    goPayment(id) {
      this.$router.push({
        path: '/settlementFinance/payment/paymentMGT',
        query: {
          id
        }
      });
    },
    goRouter(id) {
      this.$router.push({
        path: '/order/sale/saleOrderDetail',
        query: {
          id
        }
      });
    },
    // 交易记录
    getOrderNumList(bid) {
      let obj = {
        customerUserBid: bid
      }
      getSaleOrderList(obj).then(res => {
        this.orderList = res.data.list;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    // 收款记录
    getGathering(bid) {
      selectSalesCollectionRecord({ customerBId: bid }).then(res => {
        this.gatheringList = res.data;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    // 付款记录
    getPaymentList(bid) {
      let obj = {
        customerBId: bid,
        pageNum: 1,
        pageSize: 5
      }
      pagephPaymentRecord(obj).then(res => {
        this.paymentList = res.data.list;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    openRecord(row) {
      this.dialogVisibleDetail = true
      this.adsPosition = deepClone(row);
      this.filesList = row.filesList;
      listCustomerInfoContactApi({ pageNum: 1, pageSize: 10 }).then(res => {
        this.clientList = res.data
      })
    },
    // addCustomerRecord(id, customerName) {
    //   this.$router.push({
    //     query: {
    //       id, customerName
    //     },
    //     path: '/customer/communicationRecord'
    //   })
    // },
    clearDialog() {
      this.$refs['customerData'].resetFields();
      this.customerData.bid = '';
      this.customerData.ownField = '';
      this.customerData.deliveryPort = '';
      this.customerData.ownFielList = [];
      this.customerData.commLanguageList = [];
      // this.customerData = [];
    },
    changeTabs(name) {
      switch (Number(name)) {
        case 2: this.getRecord(this.customerBID); break;
        // case 3: this.getPayments(); break;
        // case 4: this.getCooperFile(); break;
        // case 5: this.getLinkPeople(); break;
        case 5: this.getOrderNumList(this.customerBID); break;
        case 6: this.getPaymentList(this.customerBID)
          this.getGathering(this.customerBID); break;
        default: break;
      }
    },
    // 弹窗类别转化字符串
    getParentId(arr) {
      if (arr.length) {
        this.customerData.custSortBId = arr.join(',')
      } else {
        this.customerData.custSortBId = ''
      }
    },
    // 主列表数组转为字符串搜索
    getParentId1(arr) {
      if (arr.length) {
        this.postData.custSortBId = arr.join(',')
      } else {
        this.postData.custSortBId = ''
      }
    },
    setOtherList(val) {
      this.languageList1 = this.languageList.filter(e => {
        return e.id !== val
      });
      if (this.linkForm.preferedLanguageStr.includes(val)) {
        this.linkForm.preferedLanguageStr = this.linkForm.preferedLanguageStr.filter(e => e !== val)
      }
    },
    // 常用语言转为字符
    getcommLanguage1(arr) {
      if (arr.length) {
        this.linkForm.preferedLanguage = arr.join(',')
      } else {
        this.linkForm.preferedLanguage = ''
      }
    },
    // 港口id数组转为字符
    getdeliveryPort(arr) {
      if (arr.length) {
        this.customerData.deliveryPort = arr.join(',')
      } else {
        this.customerData.deliveryPort = ''
      }
    },
    // 常用语言转为字符
    getcommLanguage(arr) {
      if (arr.length) {
        this.customerData.commLanguageString = arr.join(',')
      } else {
        this.customerData.commLanguageString = ''
      }
    },
    // 所属领域转为字符
    getownField(arr) {
      if (arr.length) {
        this.customerData.ownFieldString = arr.join(',')
      } else {
        this.customerData.ownFieldString = ''
      }
    },
    getSelectCategoryList(arr) {
      let arr1 = [];
      arr.forEach(e => {
        if (e.check || e.check2) {
          arr1.push(e)
        }
        if (e.children && e.children.length) {
          arr1 = arr1.concat(this.getSelectCategoryList(e.children))
        }
      });
      return arr1
    },
    checkAll1(flag) {
      this.categoryList.forEach(e => {
        e.check = flag
      })
    },
    checkAll2(flag) {
      this.categoryList.forEach(e => {
        e.check2 = flag
      })
    },
    // 搜索
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList();
    },
    // 获取主页菜单
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key]) {
          obj[key] = this.postData[key]
        }
      }
      listCustomerInfo(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
    },
    // 获取等级列表
    getGradeList() {
      listMemberLevel().then(res => {
        this.gradeList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取分类列表
    getSortList() {
      listSort({ pageNum: 1, pageSize: 999 }).then(res => {
        this.sortList = res.data.list || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 查询后台用户
    getAccountUserList(val) {
      const _this = this;
      if (val !== '') {
        this.userLoading = true;
        selectUserListAllApi(val).then(res => {
          _this.accountUserListSelect = res.data;
          _this.userLoading = false;
        });
      } else {
        this.accountUserListSelect = [];
      }
    },
    // 查询获取国家
    getCountryList(query) {
      if (query !== '') {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          selectCountryListApi(query).then(res => {
            this.countryList = res.data || []
          })
        }, 200);
      } else {
        this.countryList = [];
      }
    },
    getCountryAllList() {
      selectCountryListApi().then(res => {
        this.countryList = res.data || []
      })
    },
    // 获取后台用户
    getUserAccountList() {
      getAdminUserList().then(res => {
        this.accountUserList = res.data || []
      })
    },
    // 打开详情弹窗
    openDetail(row) {
      let id = row.bid
      this.customerBID = row.bid
      this.customBid = row.bid
      this.customerName = row.customerName
      this.activeName = '1';
      this.detailVisible = true;
      this.$nextTick(() => {
        this.$refs.reViewQuoted.getDataList()
        this.$refs.reViewInquiry.getDataList()
      })
      let obj = {
        bid: id
      };
      getCustomerInfoByBId(obj).then(res => {
        this.customerData = Object.assign(this.customerData, res.data);
        this.customerData.sortName = this.customerData.custSortBId.split(',');
        if (res.data.deliveryPort) {
          this.customerData.deliveryPortArr = this.customerData.deliveryPort.split(',');
        } else {
          this.customerData.deliveryPortArr = []
        }
        if (res.data.ownField) {
          this.customerData.ownFieldList = this.customerData.ownField.split(',');
        } else {
          this.customerData.ownFieldList = []
        }
        if (res.data.deliveryPort) {
          this.customerData.commLanguageList = this.customerData.commLanguage.split(',');
        } else {
          this.customerData.commLanguageList = []
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
      communicaList({ Bid: id })
        .then(res => {
        }).catch(err => {
          this.$message({ message: err.message });
        })
      // }
    },
    //  沟通记录
    getRecord(id) {
      listCustomerCommunicationApi({
        customerBId: id,
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        this.recordList = res.data.list
      })
    },
    // 客户列表多选
    getSelect(selects) {
      this.selectList = selects;
    },
    // 打开用户列表
    addFromUserList() {
      this.selectLinkVisible = true;
      this.getSelectUserList()
    },
    // 从用户列表别获取联系人
    getSelectUserList() {
      let obj = {};
      this.userListPrams.pageIndex = 1;
      for (let key in this.userListPrams) {
        if (this.userListPrams[key]) {
          obj[key] = this.userListPrams[key]
        }
      }
      getClientUserList(obj).then(res => {
        this.linkList = res.data.list || [];
        this.userListPrams.total = res.data.total
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 选中用户，单选
    singleSelectUser(selects) {
      this.selectLinkPeople = selects;
    },
    openBankDialog(type, row) {
      if (type === 'edit') {
        this.bankForm = deepClone(row)
      } else {
        this.bankForm = {
          bankAccount: '',
          bankName: '',
          reservedPhone: '',
          swiftCode: '',
          bankAddress: '',
          branchName: '',
          accountType: 1,
          defaultValue: 0,
          accountCurrency: ''
        }
      }
      this.bankDialogType = type;
      this.addBankVisible = true;
    },
    getBankSelect(selects) {
      this.bankSelectList = selects
    },
    arrSplice(arr, index) {
      arr.splice(index, 1)
    },
    // 把多选框选的值由数组转换为字符串
    getCheckBoxVal(arr) {
      this.spt.shipmentType = arr.join(',')
    },
    // 获取时间范围拆分
    getRangeTime(arr) {
      if (arr && arr.length) {
        this.cooperObj.beginTime = arr[0];
        this.cooperObj.endTime = arr[1]
      } else {
        this.cooperObj.beginTime = '';
        this.cooperObj.endTime = ''
      }
    },
    exportExcel() {
      exportCustomer().then(res => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', '客户.xls')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val, '{y}-{m}-{d}')
      }
    },
    commTypeFmt(val) {
      switch (val) {
        case 1: return '即时通讯';
        case 2: return '邮件';
        case 3: return '电话';
        case 4: return '见面';
        default:
          return '不存在';
      }
    },
    orderStatusFmt: function (val) {
      let statusName = '';
      if (val === 0) {
        statusName = '作废';
      } else if (val === 1) {
        statusName = '编辑中';
      } else if (val === 2) {
        statusName = '审核中';
      } else if (val === 3) {
        statusName = '审核驳回';
      } else if (val === 4) {
        statusName = '待确认';
      } else if (val === 5) {
        statusName = '已确认';
      }
      return statusName;
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .customer-container {
    .divleft{
      text-align: right;
    }
    .search-box {
      margin-bottom: 15px;
      border-bottom: 1px solid $border-light-color;
    }
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      .export {
        background: green;
        border: green;
      }
      button {
        margin: 0 10px;
      }
    }
    .menuDialog {
      .el-dialog {
        width: 500px;
      }
    }
    .category-form {
      display: flex;
      display: -webkit-flex;
      width: 86%;
      margin: 10px auto;
      >div {
        flex: 1;
        line-height: 32px;
      }
    }
  }
  .avatar {
    text-align: center;
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      height: 150px;
      line-height: 150px;
      text-align: center;
      border: 1px solid $border-light-color;
    }

    .avatar {
      width: 150px;
      height: 150px;
      display: block;
    }
  }
</style>
