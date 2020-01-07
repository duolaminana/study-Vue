<template>
  <div class="app-container supplier-container">
    <div class="search-box">
      <el-form label-width="100px" inline size="small">
        <div>
          <el-form-item label="供应商名称">
            <el-input v-model="postData.supplierName" clearable placeholder="请输入供应商名称" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="分类">
            <el-cascader
              style="width: 200px"
              v-model="searchSortName"
              :options="sortList"
              :props="{value: 'bid', label: 'supplierSortName', children: 'children'}"
              filterable
              clearable
              placeholder="可搜索"
              change-on-select
              @change="getParentId1"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="等级">
            <el-select v-model="postData.supplierGradeBId" clearable placeholder="请选择等级" style="width: 200px">
              <el-option v-for="(item, index) in gradeList" :label="item.levelName" :value="item.bid"
                         :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="供应商编码">
            <el-input v-model="postData.supplierCode" clearable placeholder="请输入供应商编码" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="国家">
            <el-input v-model="postData.countryCode" clearable placeholder="请输入国家" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="postData.officePhone" clearable placeholder="请输入电话" style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <!--<el-button type="primary" size="small" @click="openEdit('add')">新增</el-button>-->
      <!--<el-button type="primary" size="small" @click="deleteSupplier()">删除</el-button>-->
      <el-button type="primary" size="small" @click="outportData" class="export">导出excel</el-button>
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

      <el-table-column label="供应商名称" prop="supplierName" show-overflow-tooltip/>

      <el-table-column label="供应商编码" prop="supplierCode" show-overflow-tooltip/>

      <el-table-column label="国家" prop="countryCode" show-overflow-tooltip/>

      <el-table-column label="电话" prop="officePhone" show-overflow-tooltip/>

      <el-table-column align="center" width="100" label="修改人" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="160" label="修改时间" prop="updateTime">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="265" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="openDetail(scope.row)">查看
          </el-button>
          <!--<el-button type="primary" size="mini" class="table-btn-width" @click="openEdit('edit',scope.row.bid)">编辑-->
          <!--</el-button>-->
          <!--&lt;!&ndash;<el-button type="danger" size="mini" @click="deleteSupplier(scope.row.bid)">删除</el-button>&ndash;&gt;-->
          <!--<el-button type="primary" size="mini" class="table-btn-width"-->
                     <!--@click="addSupplierRecord(scope.row.bid,scope.row.supplierName)">沟通记录-->
          <!--</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize"
                @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="detailVisible" title="查看供应商" width="1000px" center @close="clearDialog">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="1">
          <el-form ref="supplierData" :model="supplierData" label-width="120px" inline label-position="right"
                   size="small" >
            <el-form-item label="供应商编码" prop="supplierCode">
              <el-input v-model="supplierData.supplierCode" readonly placeholder="供应商编码" class="form-dialog-width"
                        style="width: 600px"/>
            </el-form-item>
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input v-model="supplierData.supplierName" readonly placeholder="供应商名称" class="form-dialog-width"
                        style="width: 600px"/>
            </el-form-item>
            <!--<el-form-item label="公司名称" prop="companyName">-->
            <!--<el-input v-model="supplierData.companyName" readonly placeholder="公司名称" class="form-dialog-width" style="width: 600px"/>-->
            <!--</el-form-item>-->
            <el-form-item label="供应商简称" prop="shortName">
              <el-input v-model="supplierData.shortName" readonly placeholder="供应商简称" class="form-dialog-width"
                        style="width: 600px"/>
            </el-form-item>
            <el-form-item label="国家" prop="countryCode">
              <el-select
                v-model="supplierData.countryCode"
                readonly
                filterable
                remote
                placeholder="请输入关键词"
                :remote-method="getCountryList"
                :loading="Loading1"
                class="form-dialog-width"
                style="width: 600px"
              >
                <el-option v-for="(item, index) in countryList" :label="item.searchStr" :value="item.countryCode"
                           :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="注册地址" prop="registerAddress">
              <el-input v-model="supplierData.registerAddress" readonly placeholder="注册地址" class="form-dialog-width"
                        style="width: 600px"/>
            </el-form-item>
            <el-form-item label="办公地址" prop="officeAddress">
              <el-input v-model="supplierData.officeAddress" readonly placeholder="办公地址" class="form-dialog-width"
                        style="width: 600px"/>
            </el-form-item>
            <el-form-item label="公司地址" prop="otherAddress">
              <el-input v-model="supplierData.otherAddress" readonly placeholder="公司地址" class="form-dialog-width"
                        style="width: 600px"/>
            </el-form-item>

            <el-form-item label="邮政编码" prop="postalCode">
              <el-input v-model="supplierData.postalCode" readonly placeholder="邮政编码" class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item label="州/省地区" prop="provinceCode">
              <el-input v-model="supplierData.provinceCode" readonly placeholder="州/省地区" class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item label="办公电话1" prop="officePhone">
              <el-input v-model="supplierData.officePhone" readonly placeholder="办公电话1" class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item label="办公电话2" prop="officePhone2">
              <el-input v-model="supplierData.officePhone2" readonly placeholder="办公电话2" class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item label="移动电话1" prop="mobilePhone">
              <el-input v-model="supplierData.mobilePhone" readonly placeholder="移动电话1" class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item label="移动电话2" prop="mobilePhone2">
              <el-input v-model="supplierData.mobilePhone2" readonly placeholder="移动电话2" class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item label="传真1" prop="facsimileNo">
              <el-input v-model="supplierData.facsimileNo" readonly placeholder="传真1" class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item label="传真2" prop="facsimileNo2">
              <el-input v-model="supplierData.facsimileNo2" readonly placeholder="传真2" class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item label="Email" prop="emailAddress">
              <el-input v-model="supplierData.emailAddress" readonly placeholder="Email" class="form-dialog-width"
                        style="width: 600px"/>
            </el-form-item>
            <el-form-item label="税号" prop="taxNo">
              <el-input v-model="supplierData.taxNo" readonly placeholder="税号" class="form-dialog-width"
                        style="width: 600px"/>
            </el-form-item>
            <el-form-item label="供应商分类" prop="supplierSortName">
              <el-cascader
                class="form-dialog-width"
                v-model="supplierData.supplierSortName"
                :options="sortList"
                :props="{value: 'bid', label: 'supplierSortName', children: 'children'}"
                filterable
                disabled
                placeholder="可搜索"
                change-on-select
              ></el-cascader>
            </el-form-item>
            <el-form-item label="供应商等级" prop="supplierGradeBId">
              <el-select v-model="supplierData.supplierGradeBId" disabled class="form-dialog-width">
                <el-option v-for="(item, index) in gradeList" :label="item.levelName" :value="item.bid"
                           :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交易状态" prop="transaStatus">
              <el-radio-group v-model="supplierData.transaStatus" style="width: 600px;">
                <el-radio :label="1">已成交</el-radio>
                <el-radio :label="2">未成交</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="客户来源" prop="customerSource">
              <el-radio-group v-model="supplierData.customerSource" style="width: 600px;">
                <el-radio v-for="(item, index) in customerSourceList" :label="item.id" :key="index">{{item.label}}
                </el-radio>
                <!--                  <el-radio :label="1">自助开发</el-radio>-->
                <!--                  <el-radio :label="2">询盘</el-radio>-->
                <!--                  <el-radio :label="3">展会</el-radio>-->
              </el-radio-group>
            </el-form-item>
            <el-form-item label="所属领域" prop="ownFieldList">
              <el-checkbox-group v-model="supplierData.ownFieldList" style="width: 600px;" @change="getownField">
                <el-checkbox v-for="(item, index) in ownFiledList" :label="item.label" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <div>
              <el-form-item label="状态" prop="supplierStatus">
                <!--<el-select v-model="supplierData.supplierStatus" disabled="true" placeholder="请选择客户状态" class="form-dialog-width">-->
                <!--<el-option v-for="(item, index) in statusList" :label="item.label" :value="item.id" :key="index"></el-option>-->
                <!--</el-select>-->
                {{supplierData.supplierStatus === 1 ? '启用' : '禁用'}}
              </el-form-item>
            </div>
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="supplierData.remarks" type="textarea" readonly placeholder="备注" style="width: 600px"/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--银行账户信息-->
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
                {{supplierName}}
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
            <span @click="$router.push({path:'/supplier/supplierRecord'})">更多>></span>
          </div>
        </el-tab-pane>
        <!--询价记录-->
        <el-tab-pane label="报价记录" name="3">
          <quoted :supplier-b-id="supplierBId" ref="reViewQuoted"></quoted>
        </el-tab-pane>
        <!--报价记录-->
        <el-tab-pane label="询价记录" name="4">
          <inquiry :supplier-b-id="supplierBId" ref="reViewInquiry"></inquiry>
        </el-tab-pane>
        <!--交易记录-->
        <el-tab-pane label="交易记录" name="5">
          <div>销售订单</div>
          <el-table
            v-loading="listLoading"
            :data="orderList"
            element-loading-text="正在查询中。。。"
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
            sellerSwifcode
            <el-table-column label="供应商编码" prop="sellerSwifcode" show-overflow-tooltip/>

            <el-table-column label="供应商名称" prop="sellerName" show-overflow-tooltip/>
            <!--<el-table-column label="国家" show-overflow-tooltip>-->
              <!--<template slot-scope="scope">-->
                <!--{{scope.row.buyerCountryCode}}/{{scope.row.buyerTelephone}}-->
              <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="电话" align="center" prop="sellerTelephone" show-overflow-tooltip/>
            <!--<el-table-column align="center" width="80" label="SKU数" prop="prodcutSkuCount" />-->

            <el-table-column align="center" label="金额" prop="totalAmount" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.totalAmount | moneyFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="100" label="创建人" prop="createUserId" show-overflow-tooltip/>

            <el-table-column align="center" width="150" label="订单日期" prop="createTime">
              <template slot-scope="scope">
                {{scope.row.createTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="80px" label="状态" prop="orderStatus">
              <template slot-scope="scope">
                {{scope.row.orderStatus | orderStatusFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export table-btn-width" @click="goRouter(scope.row.bid)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:20px;text-align:right;cursor:pointer">
            <span @click="$router.push({path:'/order/sale/saleOrder',query:{customerUserBid:supplierBId}})">更多>></span>
          </div>
          <div>采购订单</div>
          <el-table
            v-loading="listLoading"
            :data="purchaseOrderList"
            element-loading-text="正在查询中。。。"
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
            <el-table-column label="订单号" prop="purchaseNo" show-overflow-tooltip/>

            <el-table-column label="供应商编码" prop="sellerCode" show-overflow-tooltip/>

            <el-table-column label="供应商名称" prop="sellerName" show-overflow-tooltip/>

            <el-table-column label="电话" prop="sellerTelephone" show-overflow-tooltip/>

            <!--<el-table-column align="center" width="70" label="SKU数" prop="skuCount" />-->

            <el-table-column align="center" label="金额" prop="netTotalAmount" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.totalAmount | moneyFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="100" label="创建人" prop="updateUserId" show-overflow-tooltip/>

            <el-table-column align="center" width="150" label="订单日期" prop="orderCreateTime">
              <template slot-scope="scope">
                {{scope.row.orderCreateTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="80px" label="状态" prop="orderStatus">
              <template slot-scope="scope">
                {{scope.row.orderStatus | orderStatusFmt}}
              </template>
            </el-table-column>

            <el-table-column header-align="center" label="操作" width="280" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export table-btn-width" @click="goRouter(scope.row.bid)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:20px;text-align:right;cursor:pointer">
            <span @click="$router.push({path:'/order/purchase/purchaseOrder',query: {customerUserBid:supplierBId}})">更多>></span>
          </div>
        </el-tab-pane>
        <!--收付款记录-->
        <el-tab-pane label="收付款记录" name="6">
          <div>收款记录</div>
          <div class="topBtns">
            <el-button type="primary" size="small" class="export" >导出</el-button>
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

            <el-table-column label="客户简称" prop="buyerShort" show-overflow-tooltip>
            </el-table-column>
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

            <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export table-btn-width" @click="goGathering(scope.row.bid)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:20px;text-align:right;cursor:pointer">
            <span @click="goMore">更多>></span>
          </div>
          <div>付款记录</div>
          <div class="topBtns">
            <el-button type="primary" size="small" class="export" >导出</el-button>
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
            <el-table-column label="订单编号" prop="paymentAssociatedOrders" show-overflow-tooltip/>

            <el-table-column label="客户简称" prop="buyerShort" show-overflow-tooltip>
            <template>
              {{supplierName}}
            </template>
            </el-table-column>
            <el-table-column align="center" label="金额" prop="paymentAmount" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.paymentAmount | moneyFmt}}
              </template>
            </el-table-column>

            <el-table-column label="币种" width="100" prop="paymentCurrency" show-overflow-tooltip/>

            <el-table-column align="center" width="150" label="收到付款时间" prop="paymentTime">
              <template slot-scope="scope">
                {{scope.row.paymentTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export table-btn-width" @click="goPayment(scope.row.bid)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:20px;text-align:right;cursor:pointer">
            <span @click="$router.push({path: '/settlementFinance/payment/purchaseOrder', query: {customerBId:supplierBId} })">更多>></span>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleDetail" title="供应商沟通记录详情" center width="950px">
      <el-form ref="addCompany" :model="adsPosition" label-width="100px" label-position="right" size="small">
        <el-form-item label="供应商名称" prop="customerBId">
          <!--<el-select v-model="adsPosition.customerBId" clearable style="width: 330px" disabled>-->
            <!--<el-option v-for="(item, index) in clientList" :label="item.supplierNam" :value="item.bid" :key="index"></el-option>-->
          <!--</el-select>-->
          <template>
            {{supplierName}}
          </template>
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
import Tinymce from '@/components/Tinymce'
import {
  getAllSortList,
  gradeList,
  supplierDetailById,
  supplierPageList,
  exportExcelSupplierList,
  listSupplierCommunicationApi
} from '@/api/supplier';
import { uploadActionUrl } from '@/api/common'
// import { supplierPageList } from '@/api/customer'
import { selectCountryListApi, selectCurrencyCodeListApi } from '@/api/system'
import { pagephPaymentRecord } from '@/api/finance'
import { getAdminUserList, selectUserListAllApi, getClientUserList } from '@/api/user'
import { getToken } from '@/utils/auth'
import { deepClone, parseTime } from '@/utils/index'
import inquiry from '@/views/customer/customerOverview/inquiry'
import quoted from '@/views/customer/customerOverview/quoted'
import moneyFmt from '@/mixin/moneyFmt'
// import { uploadActionUrl } from "@/api/common";
import {
  pageInfoSalesOrderForSupplier,
  pageInfoBySupplierBId,
  selectSalesCollectionRecord
} from "@/api/order";

export default {
  components: {
    Pagination,
    quoted,
    inquiry,
    Tinymce
  },
  mixins: [moneyFmt],
  data() {
    return {
      filesList: [],
      adsPosition: {
        supplierNam: '',
        supplierBId: '',
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
        customeTime: "",
        supplierName: ""
      },
      purchaseOrderList: [],
      paymentList: [],
      recordList: [],
      orderList: [],
      gatheringList: [],
      supplierBId: '',
      supplierName: '',
      uploadActionUrl,
      activeName: '1',
      dialogVisibleDetail: false,
      listLoading: true,
      loading1: false,
      confirmLoading: false,
      editVisible: false,
      detailVisible: false,
      addLinkVisible: false,
      selectLinkVisible: false,
      addServiceVisible: false,
      addBankVisible: false,
      Loading1: false,
      dialogType: '',
      supplierData: {
        ownField: '',
        ownFieldList: [],
        // commLanguageList: [],
        commLanguage: '',
        supplierName: '',
        shortName: '',
        supplierCode: '',
        countryCode: '',
        // companyName: '',
        supplierStatus: 1,
        chargeBy: '',
        provinceCode: '',
        registerAddress: '',
        emailAddress: '',
        mobilePhone: '',
        facsimileNo: '',
        deliveryPort: '',
        deliveryPortArr: [],
        supplierSortBId: '',
        supplierGradeBId: '',
        supplierSortName: [],
        customerSource: '',
        transaStatus: '',
        // preferredLanguage: '',
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
      spt: {
        paymentMethod: '',
        shipmentTypeArr: [],
        shipmentType: '',
        paymentType: '',
        deliveryPort: '',
        currencyCode: ''
      },
      controlTowerList: [],
      sbalist: [{ bankAccount: '', bankName: '', reservedPhone: '', swiftCode: '' }],
      scplist: [],
      sclist: [],
      sslist: [],
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
        userType: 2,
        countryCode: '',
        preferedLanguageStr: []
      },
      bankSelectList: [],
      bankDialogType: 'add',
      bankForm: {
        bankAccount: '',
        bankName: '',
        reservedPhone: '',
        swiftCode: '',
        bankAddress: '',
        branchName: '',
        accountType: 1,
        defaultValue: 0,
        accountCurrency: ''
      },
      userListPrams: {
        pageSize: 10,
        total: 0,
        pageIndex: 1,
        searchKey: ''
      },
      selectLinkPeople: [],
      labelList: [
        {
          id: '1',
          name: '需重点关注',
          color: 'red'
        },
        {
          id: '2',
          name: '特别难缠',
          color: 'green'
        },
        {
          id: '3',
          name: '价格敏感',
          color: 'blue'
        },
        {
          id: '4',
          name: '资金紧张',
          color: 'orange'
        }
      ],
      clientList: [],
      checkAll: false,
      countryList: [],
      currencyCodeList: [],
      selectList: [],
      sortList: [],
      gradeList: [],
      linkList: [],
      accountUserList: [],
      jobList: [],
      searchSortName: [],
      languageList1: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        supplierName: '',
        supplierSortId: '',
        supplierGradeId: '',
        supplierCode: '',
        countryCode: '',
        officePhone: '',
        supplierStatus: ''
      },
      reviewForm: {
        idlist: '',
        supplierStatus: 0
      },
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
      cooperTypeList: [
        {
          label: '代理',
          id: 1
        },
        {
          label: '分销',
          id: 2
        },
        {
          label: '直营',
          id: 3
        },
        {
          label: '代销',
          id: 4
        }
      ],
      supplierStatusList: [
        {
          label: '启用',
          id: 1
        },
        {
          label: '禁用',
          id: 2
        }
      ],
      portList: [
        {
          label: '港口1',
          bid: '1'
        },
        {
          label: '港口2',
          bid: '2'
        },
        {
          label: '港口3',
          bid: '3'
        },
        {
          label: '港口4',
          bid: '4'
        }
      ],
      adminUserList: [],
      dataList: [],
      supplierStatus: [],
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
    // this.getUserAccountList();
    this.getCountryAllList();
    this.getCurrencyCodeListFun();
  },
  methods: {
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
    goGathering(id) {
      this.$router.push({
        path: '/settlementFinance/sale/editPayRecord',
        query: {
          id
        }
      });
    },
    openRecord(row) {
      this.dialogVisibleDetail = true
      this.adsPosition = deepClone(row);
      this.filesList = row.filesList;
      supplierPageList({ pageNum: 1, pageSize: 999 }).then(res => {
        this.clientList = res.data.list
        console.log(this.clientList)
      })
    },
    // 收款记录跳转
    goMore() {
      let obj = { supplierBId: this.supplierBId }
      console.log(obj)
      this.$router.push({
        path: '/settlementFinance/sale/paymentProof', query: obj })
    },
    // 交易记录 销售订单
    getOrderNumList(bid) {
      pageInfoSalesOrderForSupplier({ supplierBId: bid }).then(res => {
        this.orderList = res.data.list;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    // 采购订单
    getPurchaseList(bid) {
      pageInfoBySupplierBId({ supplierBId: bid }).then(res => {
        this.purchaseOrderList = res.data.list;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    // // 收款记录
    getGathering(bid) {
      selectSalesCollectionRecord({ supplierBId: bid }).then(res => {
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
    //  沟通记录
    getRecord(id) {
      listSupplierCommunicationApi({
        supplierBId: id,
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        this.recordList = res.data.list
      })
    },
    clearDetailDialog() {
      this.$refs['supplierData'].resetFields();
      this.supplierData.bid = ''
      this.supplierData.ownField = '';
      this.supplierData.deliveryPort = '';
      this.supplierData.countryCode = '';
      this.supplierData.ownFielList = [];
      // this.supplierData.commLanguageList = [];
      this.detailVisible = false;
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
    addSupplierRecord(id, supplierName) {
      this.$router.push({
        query: {
          id, supplierName
        },
        path: '/supplier/communication'
      })
    },
    clearDialog() {
      this.$refs['supplierData'].resetFields();
      this.supplierData.bid = '';
      this.supplierData.ownField = '';
      this.supplierData.deliveryPort = '';
      this.supplierData.countryCode = '';
      this.supplierData.ownFielList = [];
      // this.supplierData.commLanguageList = [];
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
    getcommLanguage(arr) {
      if (arr.length) {
        this.linkForm.preferedLanguage = arr.join(',')
      } else {
        this.linkForm.preferedLanguage = ''
      }
    },
    getCountryAllList() {
      selectCountryListApi().then(res => {
        this.countryList = res.data || []
      })
    },
    // 弹窗类别转化字符串
    getParentId(arr) {
      if (arr.length) {
        this.supplierData.supplierSortBId = arr.join(',')
      } else {
        this.supplierData.supplierSortBId = ''
      }
    },
    // 主列表数组转为字符串搜索
    getParentId1(arr) {
      if (arr.length) {
        this.postData.supplierSortBId = arr.join(',')
      } else {
        this.postData.supplierSortBId = ''
      }
    },
    // 港口id数组转为字符
    getPortIds(arr) {
      if (arr.length) {
        this.supplierData.deliveryPort = arr.join(',')
      } else {
        this.supplierData.deliveryPort = ''
      }
    },
    // 所属领域转为字符
    getownField(arr) {
      if (arr.length) {
        this.supplierData.ownFieldString = arr.join(',')
      } else {
        this.supplierData.ownFieldString = ''
      }
    },
    // 点击切换tabs
    // changeTabs(name) {
    //   if (name !== '1' && !this.supplierData.bid) {
    //     this.$message.warning('请先填写完整基础信息并保存成功');
    //     return false
    //   }
    //   switch (Number(name)) {
    //     case 2:
    //       this.getSupplierBankList();
    //       break;
    //     case 3:
    //       this.getPayments();
    //       break;
    //     case 4:
    //       this.getCooperFile();
    //       break;
    //     case 5:
    //       this.getLinkPeople();
    //       break;
    //     case 6:
    //       this.getServiceList();
    //       break;
    //     default:
    //       break;
    //   }
    // },
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
      supplierPageList(obj).then(res => {
        this.dataList = res.data.list;
        console.log(this.dataList)
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
    },
    // 获取等级列表
    getGradeList() {
      gradeList().then(res => {
        this.gradeList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取分类列表
    getSortList() {
      getAllSortList().then(res => {
        this.sortList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 查询获取国家
    getLinkFormCountryList(query) {
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
    // 获取币种列表
    getCurrencyCodeListFun() {
      selectCurrencyCodeListApi().then(res => {
        this.currencyCodeList = res.data || [];
      });
    },
    // 获取后台用户
    getUserAccountList() {
      getAdminUserList().then(res => {
        this.accountUserList = res.data || []
      })
    },
    getAccountUserList(val) {
      const _this = this;
      if (val !== '') {
        this.loading1 = true;
        selectUserListAllApi(val).then(res => {
          _this.accountUserList = res.data;
          _this.loading1 = false;
        });
      } else {
        this.accountUserList = [];
      }
    },
    // 打开详情弹窗
    openDetail(row) {
      let id = row.bid
      this.supplierName = row.supplierName
      this.supplierBId = row.bid
      this.activeName = '1';
      this.detailVisible = true;
      this.$nextTick(() => {
        this.$refs.reViewQuoted.getDataList()
        this.$refs.reViewInquiry.getDataList()
      })
      let obj = {
        bid: id
      };
      this.getRecord(id)
      this.getOrderNumList(id)
      this.getPurchaseList(id)
      this.getGathering(id)
      this.getPaymentList(id)
      supplierDetailById(obj).then(res => {
        this.supplierData = Object.assign(this.supplierData, res.data);
        this.supplierData.supplierSortName = this.supplierData.supplierSortBId.split(',');
        if (res.data.deliveryPort) {
          this.supplierData.deliveryPortArr = this.supplierData.deliveryPort.split(',');
        } else {
          this.supplierData.deliveryPortArr = []
        }
        if (res.data.ownField) {
          this.supplierData.ownFieldList = this.supplierData.ownField.split(',');
        } else {
          this.supplierData.ownFieldList = []
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 供应商列表多选
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
    singleSelectUser(arr) {
      this.selectLinkPeople = arr;
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportExcelSupplierList(obj).then(res => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', '供应商详情管理列表.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
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
    }
    // 新增协议
    // addPactFileList() {
    //   if (!this.cooperObj.cooperMode || !this.cooperObj.rangeTime || !this.cooperObj.pactFile) {
    //     return this.$message.warning('请填写完整和上传文件');
    //   }
    //   // this.scplist.push({ ...this.cooperObj });
    //   this.cooperObj.supplierBId = this.supplierData.bid
    //   addCooperFile(this.cooperObj).then(res => {
    //     this.$message.success('新增成功');
    //     this.cooperObj.cooperMode = '';
    //     this.cooperObj.beginTime = '';
    //     this.cooperObj.endTime = '';
    //     this.cooperObj.rangeTime = null;
    //     this.cooperObj.pactFile = '';
    //     this.cooperObj.pactFileUuid = '';
    //     this.cooperObj.pactFilePath = '';
    //     this.$refs.upload.clearFiles();
    //     this.getCooperFile()
    //   }).catch(err => {
    //     this.$message.error(err.message)
    //   });
    // },
    // 删除协议
    // removeFile(scope) {
    //   deleteCooperFile({ id: scope.row.id }).then(res => {
    //     this.$message.success('删除成功');
    //     this.getCooperFile()
    //   }).catch(err => {
    //     this.$message.error(err.message)
    //   });
    // },
    // 下载协议
    // exportPactFile(row) {
    //   window.open(row.pactFilePath);
    // },
    // // 上传文件删除
    // handleRemove(file, fileList) {
    //   this.cooperObj.pactFile = '';
    //   this.cooperObj.pactFileUuid = '';
    //   this.cooperObj.pactFilePath = '';
    // },
    // // 上传成功
    // handleSuccess(res, file, filename) {
    //   this.cooperObj.pactFile = file.name;
    //   this.cooperObj.pactFileUuid = res.data.UUID;
    //   this.cooperObj.pactFilePath = res.data.filePath;
    // },
    // handleExceed(files, fileList) {
    //   this.$message.warning(`当前限制为 1 个文件`);
    // },
    // 上传之前限制
    // beforeUpload(file) {
    //   let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
    //   const extension = testmsg === 'PDF';
    //   const extension2 = testmsg === 'pdf';
    //   const extension3 = testmsg === 'doc';
    //   const extension4 = testmsg === 'docx';
    //   const isLt2M = file.size / 1024 / 1024 < 10;
    //   if (!extension && !extension2 && !extension3 && !extension4) {
    //     this.$message({
    //       message: '上传文件只能是 PDF、doc、docx格式!',
    //       type: 'warning'
    //     });
    //   }
    //   if (!isLt2M) {
    //     this.$message({
    //       message: '上传文件大小不能超过 10MB!',
    //       type: 'warning'
    //     });
    //   }
    //   return (extension || extension2 || extension3 || extension4) && isLt2M
    // },
    // handleAvatarSuccess(res, file) {
    //   this.linkForm.photoPath = res.data.filePath;
    // },
    // beforeAvatarUpload(file) {
    //   const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    //   const isLt3M = file.size / 1024 / 1024 < 3;
    //
    //   if (!isJPG) {
    //     this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
    //   }
    //   if (!isLt3M) {
    //     this.$message.error('上传头像图片大小不能超过 3MB!');
    //   }
    //   return isJPG && isLt3M;
    // }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    commTypeFmt(val) {
      switch (val) {
        // 沟通方式(1-即时通讯 ,  2-邮件 , 3-电话 , 4-见面)
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

  .supplier-container {
    .divleft {
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
    border-color: #409eff;
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
