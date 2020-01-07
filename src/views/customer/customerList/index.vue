<template>
  <div class="app-container customer-container">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <div>
          <el-form-item label="客户名称">
            <el-input v-model="postData.customerName" clearable placeholder="请输入客户名称" style="width: 200px" />
          </el-form-item>
          <el-form-item label="分类">
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
          <el-form-item label="等级">
            <el-select v-model="postData.memberBId" clearable placeholder="请选择等级" style="width: 200px">
              <el-option v-for="(item, index) in gradeList" :label="item.levelName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="客户编码">
            <el-input v-model="postData.customerCode" clearable placeholder="请输入客户编码" style="width: 200px" />
          </el-form-item>
          <el-form-item label="国家" prop="countryCode">
            <el-select filterable remote :remote-method="getCountryList" :loading="loading1" v-model="postData.countryCode" clearable placeholder="请输入国家中文名或者英文名" style="width: 200px">
              <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index">
                {{item.searchStr}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="postData.emailAddress" clearable placeholder="请输入邮箱" style="width: 200px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openEdit('add')">新增</el-button>
      <el-button type="primary" size="small" @click="deleteCustomer()">删除</el-button>
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

      <el-table-column label="邮箱" prop="emailAddress" show-overflow-tooltip />

      <el-table-column label="分类" prop="sortName" show-overflow-tooltip />

      <el-table-column label="等级" prop="gradeName" show-overflow-tooltip />

      <el-table-column align="center" width="140px" label="修改人" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="100px" label="修改时间" prop="updateTime" show-overflow-tooltip >
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="265" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="openDetail(scope.row.bid)">查看</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" @click="openEdit('edit',scope.row.bid)">编辑</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" @click="addCustomerRecord(scope.row.bid,scope.row.customerName)">沟通记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="detailVisible" title="查看客户" width="1000px" center @close="clearDialog">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="1">
          <el-form ref="customerData" :model="customerData" label-width="120px" inline label-position="right" size="small" :rules="gradeDataRules">
            <el-form-item label="客户编码" prop="customerCode" >
              <el-input v-model="customerData.customerCode" readonly placeholder="客户编码" class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="customerData.customerName" readonly placeholder="客户名称" class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="customerData.companyName" readonly placeholder="公司名称" class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item label="客户简称" prop="shortName">
              <el-input v-model="customerData.shortName" readonly placeholder="客户简称" class="form-dialog-width" style="width: 600px"/>
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
            <el-form-item label="其他地址" prop="otherAddress">
              <el-input v-model="customerData.otherAddress" readonly placeholder="其他地址" class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item label="邮政编码" prop="postalCode">
              <el-input v-model="customerData.postalCode" readonly placeholder="邮政编码" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>
            <el-form-item label="州/省地区" prop="provinceCode">
              <el-input v-model="customerData.provinceCode" readonly placeholder="州/省地区" class="form-dialog-width" style="width: 237px"/>
            </el-form-item>
            <el-form-item label="办公电话1" prop="officePhone">
              <el-input v-model="customerData.officePhone" readonly placeholder="办公电话1" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>
            <el-form-item label="办公电话2" prop="officePhone2">
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

            <el-form-item label="Email" prop="emailAddress">
              <el-input v-model="customerData.emailAddress" readonly placeholder="Email" class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item label="税号" prop="taxNo">
              <el-input v-model="customerData.taxNo" readonly placeholder="税号" class="form-dialog-width" style="width: 600px"/>
            </el-form-item>

<!--            <el-form-item label="首选语言" prop="preferredLanguage">-->
<!--              <el-select v-model="customerData.preferredLanguage" readonly placeholder="请选择语言" class="form-dialog-width" style="width: 230px">-->
<!--                <el-option v-for="(item, index) in languageList" :label="item.label" :value="item.label" :key="index"></el-option>-->
<!--              </el-select>-->
<!--              &lt;!&ndash;                  <el-input v-model="customerData.preferredLanguage" clearable placeholder="首选语言" class="form-dialog-width" style="width: 230px"/>&ndash;&gt;-->
<!--            </el-form-item>-->
<!--            <el-form-item label="常用语言" prop="commLanguageList">-->
<!--              &lt;!&ndash;<el-input v-model="customerData.deliveryPort" clearable placeholder="收货港口" class="form-dialog-width" />&ndash;&gt;-->
<!--              <el-select v-model="customerData.commLanguageList" readonly multiple placeholder="请选择语言,多选." class="form-dialog-width" @change="getcommLanguage" style="width: 237px">-->
<!--                <el-option v-for="(item, index) in languageList" :label="item.label" :value="item.id" :key="index"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="收货港口" prop="deliveryPortArr">-->
<!--              &lt;!&ndash;<el-input v-model="customerData.deliveryPort" clearable placeholder="收货港口" class="form-dialog-width" />&ndash;&gt;-->
<!--              <el-select v-model="customerData.deliveryPortArr" readonly multiple placeholder="请选择港口,多选" class="form-dialog-width" @change="getdeliveryPort" style="width: 600px;">-->
<!--                &lt;!&ndash;<el-option v-for="(item, index) in portList" :label="item.gradeName" :value="item.bid" :key="index"></el-option>&ndash;&gt;-->
<!--                <el-option value="1" label="港口1"></el-option>-->
<!--                <el-option value="2" label="港口2"></el-option>-->
<!--                <el-option value="3" label="港口3"></el-option>-->
<!--                <el-option value="4" label="港口4"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->

            <!--              <el-form-item label="主要负责人" prop="chargeBy">-->
            <!--                <el-input v-model="customerData.chargeBy" clearable placeholder="联系电话" class="form-dialog-width" />-->
            <!--              </el-form-item>-->

            <el-form-item label="客户分类" prop="sortName">
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
            <el-form-item label="客户等级" prop="memberBId">
              <el-select v-model="customerData.memberBId" readonly placeholder="请选择客户分类" class="form-dialog-width" style="width: 237px">
                <el-option v-for="(item, index) in gradeList" :label="item.levelName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="交易状态" prop="transaStatus">
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
            <el-form-item label="所属领域" prop="ownFieldList">
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
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="customerData.remarks" type="textarea" :rows="5" readonly placeholder="税号" class="form-dialog-width" style="width: 600px"/>
            </el-form-item>

          </el-form>
        </el-tab-pane>
        <!--银行账户信息-->
        <el-tab-pane label="银行账户信息" name="2">
          <el-table
            style="margin: 10px 0"
            :data="sbalist"
            border
            fit
            size="small"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column align="center" label="银行账号" prop="bankAccount" show-overflow-tooltip >
            </el-table-column>

            <el-table-column align="center" label="开户银行" prop="bankName" show-overflow-tooltip>
            </el-table-column>

            <el-table-column align="center" label="开户行地址" prop="bankAddress" show-overflow-tooltip>
            </el-table-column>

            <el-table-column align="center" label="预留电话" prop="reservedPhone" show-overflow-tooltip>
            </el-table-column>

            <el-table-column align="center" label="账户币种" prop="accountCurrency" show-overflow-tooltip >
            </el-table-column>

            <el-table-column align="center" label="switf编码" prop="swiftCode" show-overflow-tooltip>
            </el-table-column>

            <el-table-column align="center" label="默认账户" prop="defaultValue">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.defaultValue" disabled :label="1">{{null}}</el-radio>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--付款条件-->
        <el-tab-pane label="付款条件" name="3">
          <el-form :model="spt" label-width="120px" inline label-position="right" size="small">
            <el-form-item label="默认报价类型" prop="paymentType">
              <el-radio-group v-model="spt.paymentType" disabled>
                <el-radio :label="1">FOB</el-radio>
                <el-radio :label="2">CIF</el-radio>
                <!--                <el-radio :label="3">EXW</el-radio>-->
              </el-radio-group>
            </el-form-item>
            <el-form-item label="到货港口/地址" prop="sendPortBId">
              <el-input v-model="spt.sendPortBId" readonly placeholder="到货港口/地址" class="form-dialog-width" style="width: 230px"/>
<!--              <el-select v-model="spt.sendPortBId" disabled placeholder="送货港口">-->
<!--                <el-option v-for="(item, index) in portList" :label="item.label" :value="item.bid" :key="index"></el-option>-->
<!--              </el-select>-->
            </el-form-item>
            <el-form-item label="付款方式" prop="paymentMethod">
              <el-select v-model="spt.paymentMethod" disabled placeholder="付款方式">
                <el-option label="T/T" :value="1"></el-option>
                <el-option label="L/C" :value="2"></el-option>
                <el-option label="P/A" :value="3"></el-option>
                <el-option label="D/A" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="装运方式" prop="shipmentType">
              <el-checkbox-group v-model="spt.shipmentTypeArr" disabled>
                <el-checkbox label="1">汽运</el-checkbox>
                <el-checkbox label="2">铁路</el-checkbox>
                <el-checkbox label="3">海运</el-checkbox>
                <el-checkbox label="4">空运</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="付款条件:">
              <table border="0" cellspacing="0" cellpadding="0" class="form-table" style="width: 700px">
                <thead>
                <tr>
                  <th>序号</th>
                  <th>付款节点</th>
                  <th>默认付款比例</th>
                  <th>付款时间</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in controlTowerList" :key="index">
                  <td>{{index + 1}}</td>
                  <td>{{item.nodeName}}</td>
                  <td>
                    <el-input v-model.number="item.paymentRatio" type="number" clearable style="width: 200px" >
                      <template slot="append">%</template>
                    </el-input>
                  </td>
                  <td>
                    <el-input v-model.number="item.dayNum" type="number" :min="0" :precision="0" clearable style="width: 200px" >
                      <template slot="append">天</template>
                    </el-input>
                  </td>
                </tr>
                <tr>
                  <td colspan="4" v-if="!controlTowerList.length">暂无数据</td>
                </tr>
                </tbody>
              </table>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--合作详情-->
        <el-tab-pane label="合作关系" name="4">
          <el-table
            :data="scplist"
            border
            fit
            style="margin: 10px 0"
            size="small"
            :header-cell-style="{background: '#a7bfee'}">

            <el-table-column align="center" label="合作模式" prop="cooperMode" show-overflow-tooltip />

            <el-table-column align="center" label="起止时间" prop="beginTime" show-overflow-tooltip >
              <template slot-scope="scope">
                {{scope.row.beginTime | timeFmt}}-{{scope.row.endTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="协议名称" prop="pactFile" show-overflow-tooltip />
            <el-table-column align="center" label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="exportPactFile(scope.row)">下载协议</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--联系人-->
        <el-tab-pane label="联系人" name="5">
          <el-table
            :data="sclist"
            border
            fit
            style="margin: 10px 0"
            size="small"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              label="序号"
              type="index"
              align="center"
              width="50">
            </el-table-column>

            <el-table-column align="center" label="联系人姓名" show-overflow-tooltip >
              <template slot-scope="scope">
                <a href="javascript:void (0)">{{scope.row.contactName}}</a>
              </template>
            </el-table-column>

            <el-table-column align="center" label="电话" prop="contactPhone" show-overflow-tooltip />

            <el-table-column align="center" label="账号" prop="emailAddress" show-overflow-tooltip />

            <el-table-column align="center" label="职务" prop="customerJob" show-overflow-tooltip/>
          </el-table>
        </el-tab-pane>
        <!--服务人员-->
        <el-tab-pane label="服务人员" name="6">
          <el-table
            :data="sslist"
            border
            fit
            style="margin: 10px 0"
            size="small"
            :header-cell-style="{background: '#a7bfee'}">

            <el-table-column align="center" label="姓名" prop="servingName" show-overflow-tooltip />

            <el-table-column align="center" label="职位" prop="csJob" show-overflow-tooltip/>
          </el-table>
        </el-tab-pane>
        <!--客户商品类目-->
        <el-tab-pane label="商品类目" name="7">
          <div class="category-form">
            <div>选择可售和更多的可见商品</div>
            <div>
              可见价格梯度：
              <el-select v-model="categoryForm.gradientBId" disabled placeholder="select" style="width: 200px">
                <el-option v-for="(item, index) in gradientList" :label="item.name" :value="item.id" :key="index"></el-option>
              </el-select>
            </div>
          </div>
          <el-table
            style="width:90%;margin: 10px auto"
            :data="categoryList"
            border
            fit
            size="mini"
            row-key="id"
            max-height="500"
            :header-cell-style="{background: '#a7bfee'}">

            <el-table-column
              align="center"
              type="index"
              width="55">
            </el-table-column>

            <el-table-column header-align="center" label="类目编码/名称">
              <template slot-scope="scope">
                {{scope.row.catalogCode}}/{{scope.row.catalogName}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="商品数量" prop="bankName" />

            <el-table-column align="center" label="是否可售">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.check" disabled>可售</el-checkbox>
              </template>
            </el-table-column>

            <el-table-column align="center" label="是否展示更多" prop="defaultValue">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.check2" disabled>更多</el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailVisible=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="editVisible" :close-on-click-modal="false" :title="dialogType==='add'?'新增客户':'编辑客户'" center width="900px" @close="clearDialog" label-position="right">
        <!--基础信息-->
        <el-tabs v-model="activeName" :before-leave="changeTabs">
          <el-tab-pane label="基本信息" name="1">
            <el-form ref="customerData" :model="customerData" label-width="120px" inline label-position="right" size="small" :rules="gradeDataRules">
              <el-form-item label="客户编码" prop="customerCode" >
                <el-input v-model="customerData.customerCode" clearable placeholder="客户编码" class="form-dialog-width" style="width: 600px"/>
              </el-form-item>
              <el-form-item label="客户名称" prop="customerName">
                <el-input v-model="customerData.customerName" clearable placeholder="客户名称" class="form-dialog-width" style="width: 600px"/>
              </el-form-item>
              <el-form-item label="公司名称" prop="companyName">
                <el-input v-model="customerData.companyName" clearable placeholder="公司名称" class="form-dialog-width" style="width: 600px"/>
              </el-form-item>
              <el-form-item label="客户简称" prop="shortName">
                <el-input v-model="customerData.shortName" clearable placeholder="客户简称" class="form-dialog-width" style="width: 600px"/>
              </el-form-item>
              <el-form-item label="国家" prop="countryCode" >
                <el-select
                  v-model="customerData.countryCode"
                  clearable
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
                <el-input v-model="customerData.registerAddress" clearable placeholder="注册地址" class="form-dialog-width" style="width: 600px"/>
              </el-form-item>
              <el-form-item label="办公地址" prop="officeAddress">
                <el-input v-model="customerData.officeAddress" clearable placeholder="办公地址" class="form-dialog-width" style="width: 600px"/>
              </el-form-item>
              <el-form-item label="其他地址" prop="otherAddress">
                <el-input v-model="customerData.otherAddress" clearable placeholder="其他地址" class="form-dialog-width" style="width: 600px"/>
              </el-form-item>

                  <el-form-item label="邮政编码" prop="postalCode">
                    <el-input v-model="customerData.postalCode" clearable placeholder="邮政编码" class="form-dialog-width" style="width: 230px"/>
                  </el-form-item>

                  <el-form-item label="州/省地区" prop="provinceCode">
                    <el-input v-model="customerData.provinceCode" clearable placeholder="州/省地区" class="form-dialog-width" style="width: 237px"/>
                  </el-form-item>

                  <el-form-item label="办公电话1" prop="officePhone">
                    <el-input v-model="customerData.officePhone" clearable placeholder="办公电话1" class="form-dialog-width" style="width: 230px"/>
                  </el-form-item>

                <el-form-item label="办公电话2" prop="officePhone2">
                  <el-input v-model="customerData.officePhone2" clearable placeholder="办公电话2" class="form-dialog-width" style="width: 237px"/>
                </el-form-item>

                <el-form-item label="移动电话1" prop="mobilePhone">
                  <el-input v-model="customerData.mobilePhone" clearable placeholder="移动电话1" class="form-dialog-width" style="width: 230px"/>
                </el-form-item>

                <el-form-item label="移动电话2" prop="mobilePhone2">
                  <el-input v-model="customerData.mobilePhone2" clearable placeholder="移动电话2" class="form-dialog-width" style="width: 237px"/>
                </el-form-item>

                <el-form-item label="传真1" prop="facsimileNo">
                  <el-input v-model="customerData.facsimileNo" clearable placeholder="传真1" class="form-dialog-width" style="width: 230px"/>
                </el-form-item>

                <el-form-item label="传真2" prop="facsimileNo2">
                  <el-input v-model="customerData.facsimileNo2" clearable placeholder="传真2" class="form-dialog-width" style="width: 237px"/>
                </el-form-item>

              <el-form-item label="Email" prop="emailAddress">
                <el-input v-model="customerData.emailAddress" clearable placeholder="Email" class="form-dialog-width" style="width: 600px"/>
              </el-form-item>
              <el-form-item label="税号" prop="taxNo">
                <el-input v-model="customerData.taxNo" clearable placeholder="税号" class="form-dialog-width" style="width: 600px"/>
               </el-form-item>

<!--              <el-form-item label="首选语言" prop="preferredLanguage">-->
<!--                <el-select v-model="customerData.preferredLanguage" clearable placeholder="请选择语言" class="form-dialog-width" style="width: 230px">-->
<!--                    <el-option v-for="(item, index) in languageList" :label="item.label" :value="item.label" :key="index"></el-option>-->
<!--                  </el-select>-->
<!--&lt;!&ndash;                  <el-input v-model="customerData.preferredLanguage" clearable placeholder="首选语言" class="form-dialog-width" style="width: 230px"/>&ndash;&gt;-->
<!--              </el-form-item>-->
<!--              <el-form-item label="常用语言" prop="commLanguageList">-->
<!--                &lt;!&ndash;<el-input v-model="customerData.deliveryPort" clearable placeholder="收货港口" class="form-dialog-width" />&ndash;&gt;-->
<!--                <el-select v-model="customerData.commLanguageList" multiple placeholder="请选择语言,多选." class="form-dialog-width" @change="getcommLanguage" style="width: 237px">-->
<!--                  <el-option v-for="(item, index) in languageList" :label="item.label" :value="item.id" :key="index"></el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="收货港口" prop="deliveryPortArr">-->
<!--                &lt;!&ndash;<el-input v-model="customerData.deliveryPort" clearable placeholder="收货港口" class="form-dialog-width" />&ndash;&gt;-->
<!--                <el-select v-model="customerData.deliveryPortArr" multiple placeholder="请选择港口,多选" class="form-dialog-width" @change="getdeliveryPort" style="width: 600px;">-->
<!--                  &lt;!&ndash;<el-option v-for="(item, index) in portList" :label="item.gradeName" :value="item.bid" :key="index"></el-option>&ndash;&gt;-->
<!--                  <el-option value="1" label="港口1"></el-option>-->
<!--                  <el-option value="2" label="港口2"></el-option>-->
<!--                  <el-option value="3" label="港口3"></el-option>-->
<!--                  <el-option value="4" label="港口4"></el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->

<!--              <el-form-item label="主要负责人" prop="chargeBy">-->
<!--                <el-input v-model="customerData.chargeBy" clearable placeholder="联系电话" class="form-dialog-width" />-->
<!--              </el-form-item>-->

              <el-form-item label="客户分类" prop="sortName">
                <el-cascader
                  class="form-dialog-width"
                  v-model="customerData.sortName"
                  :options="sortList"
                  :props="{value: 'bid', label: 'sortName', children: 'children'}"
                  filterable
                  clearable
                  placeholder="可搜索"
                  change-on-select
                  @change="getParentId"
                  style="width: 230px"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="客户等级" prop="memberBId">
                <el-select v-model="customerData.memberBId" clearable placeholder="请选择客户分类" class="form-dialog-width" style="width: 237px">
                  <el-option v-for="(item, index) in gradeList" :label="item.levelName" :value="item.bid" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="交易状态" prop="transaStatus">
                <el-radio-group v-model="customerData.transaStatus" style="width: 600px;">
                  <el-radio :label="1">已成交</el-radio>
                  <el-radio :label="0">未成交</el-radio>
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
              <el-form-item label="所属领域" prop="ownFieldList">
                <el-checkbox-group v-model="customerData.ownFieldList" style="width: 600px;" @change="getownField">
                  <el-checkbox v-for="(item, index) in ownFiledList" :label="item.label" :key="index"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <el-form-item label="保留字段1" prop="reservedField1">
                <el-input v-model="customerData.reservedField1" clearable placeholder="保留字段1" class="form-dialog-width" style="width: 230px"/>
              </el-form-item>

              <el-form-item label="保留字段2" prop="reservedField2">
                <el-input v-model="customerData.reservedField2" clearable placeholder="保留字段2" class="form-dialog-width" style="width: 230px"/>
              </el-form-item>

              <el-form-item label="保留字段3" prop="reservedField3">
                <el-input v-model="customerData.reservedField3" clearable placeholder="保留字段3" class="form-dialog-width" style="width: 230px"/>
              </el-form-item>

              <el-form-item label="保留字段4" prop="reservedField4">
                <el-input v-model="customerData.reservedField4" clearable placeholder="保留字段4" class="form-dialog-width" style="width: 230px"/>
              </el-form-item>

              <el-form-item label="保留字段5" prop="reservedField5">
                <el-input v-model="customerData.reservedField5" clearable placeholder="保留字段5" class="form-dialog-width" style="width: 230px"/>
              </el-form-item>

              <el-form-item label="保留字段6" prop="reservedField6">
                <el-input v-model="customerData.reservedField6" clearable placeholder="保留字段6" class="form-dialog-width" style="width: 230px"/>
              </el-form-item>

              <el-form-item label="保留字段7" prop="reservedField7">
                <el-input v-model="customerData.reservedField7" clearable placeholder="保留字段7" class="form-dialog-width" style="width: 230px"/>
              </el-form-item>

              <el-form-item label="保留字段8" prop="reservedField8">
                <el-input v-model="customerData.reservedField8" clearable placeholder="保留字段8" class="form-dialog-width" style="width: 230px"/>
              </el-form-item>

              <el-form-item label="保留字段9" prop="reservedField9">
                <el-input v-model="customerData.reservedField9" clearable placeholder="保留字段9" class="form-dialog-width" style="width: 230px"/>
              </el-form-item>

              <el-form-item label="保留字段10" prop="reservedField10">
                <el-input v-model="customerData.reservedField10" clearable placeholder="保留字段10" class="form-dialog-width" style="width: 230px"/>
              </el-form-item>

              <el-form-item label="状态" prop="customerStatus">
                <el-select v-model="customerData.customerStatus" clearable placeholder="请选择客户状态" class="form-dialog-width">
                  <el-option v-for="(item, index) in statusList" :label="item.label" :value="item.id" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="remarks">
                <el-input v-model="customerData.remarks" type="textarea" :rows="5" placeholder="备注" class="form-dialog-width" style="width: 600px"/>
              </el-form-item>
              <div style="text-align: center">
                <el-form-item>
                  <el-button type="primary" size="small" :loading="confirmLoading" @click="saveBasicMsg('customerData')">保存</el-button>
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>
          <!--银行账户信息-->
          <el-tab-pane label="银行账户信息" name="2">
            <div class="divleft">
              <el-button type="primary" size="mini" @click="openBankDialog('add')">新增</el-button>
              <el-button type="primary" size="mini" @click="removeBankAccount">删除</el-button>
            </div>
            <el-table
              style="margin: 10px 0"
              :data="sbalist"
              border
              fit
              size="small"
              :header-cell-style="{background: '#a7bfee'}"
              @selection-change="getBankSelect">

              <el-table-column
                align="center"
                type="selection"
                width="55">
              </el-table-column>

              <el-table-column align="center" label="银行账号" prop="bankAccount" show-overflow-tooltip >
              </el-table-column>

              <el-table-column align="center" label="开户银行" prop="bankName" show-overflow-tooltip>
              </el-table-column>

              <el-table-column align="center" label="开户行地址" prop="bankAddress" show-overflow-tooltip>
              </el-table-column>

              <el-table-column align="center" label="预留电话" prop="reservedPhone" show-overflow-tooltip >
              </el-table-column>

              <el-table-column align="center" label="账户币种" prop="accountCurrency" show-overflow-tooltip >
              </el-table-column>

              <el-table-column align="center" label="switf编码" prop="swiftCode" show-overflow-tooltip>
              </el-table-column>

              <el-table-column align="center" label="默认账户" prop="defaultValue">
                <template slot-scope="scope">
                  <el-radio v-model="scope.row.defaultValue" disabled :label="1">{{null}}</el-radio>
                </template>
              </el-table-column>

              <el-table-column align="center" label="操作" width="80" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <!--<el-button type="danger" size="mini" @click="removeBankAccount(sbalist, scope)">删除</el-button>-->
                  <el-button type="primary" size="mini" @click="openBankDialog('edit', scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-dialog
              width="600px"
              center
              :title="bankDialogType === 'add' ? '新增银行账户' : '编辑银行账户'"
              :close-on-click-modal="false"
              :visible.sync="addBankVisible"
              append-to-body>
              <el-form ref="bankForm" :model="bankForm" label-width="120px" label-position="right" size="mini" :rules="bankFormRules">
                <el-form-item label="银行账号" prop="bankAccount">
                  <el-input v-model="bankForm.bankAccount" clearable placeholder="银行账号" class="form-dialog-width" />
                </el-form-item>
                <el-form-item label="开户银行" prop="bankName">
                  <el-input type="tel" v-model.number="bankForm.bankName" clearable placeholder="开户银行" class="form-dialog-width" />
                </el-form-item>
                <el-form-item label="支行名称" prop="branchName">
                  <el-input v-model="bankForm.branchName" clearable placeholder="支行名称" class="form-dialog-width" />
                </el-form-item>
                <el-form-item label="银行地址" prop="bankAddress">
                  <el-input v-model="bankForm.bankAddress" clearable placeholder="银行地址" class="form-dialog-width" />
                </el-form-item>
                <el-form-item label="预留电话" prop="reservedPhone">
                  <el-input v-model="bankForm.reservedPhone" clearable placeholder="预留电话" class="form-dialog-width" />
                </el-form-item>
<!--                <el-form-item label="账户类型" prop="accountType">-->
<!--                  <el-radio-group v-model="bankForm.accountType">-->
<!--                    <el-radio :label="1">企业</el-radio>-->
<!--                    <el-radio :label="2">个人</el-radio>-->
<!--                  </el-radio-group>-->
<!--                </el-form-item>-->
                <el-form-item label="币种" prop="accountCurrency">
                  <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="bankForm.accountCurrency" clearable placeholder="币种中文名或者币种编码" class="form-dialog-width">
                    <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="SWIFT编码" prop="swiftCode">
                  <el-input v-model="bankForm.swiftCode" clearable placeholder="SWIFT编码" class="form-dialog-width" />
                </el-form-item>
                <el-form-item label="是否为默认账户" prop="defaultValue">
                  <el-radio-group v-model="bankForm.defaultValue" clearable style="width: 600px;">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="addBankAccount('bankForm')">确定</el-button>
                <el-button type="danger" size="small" @click="addBankVisible=false">取消</el-button>

              </div>
            </el-dialog>
          </el-tab-pane>
          <!--付款条件-->
          <el-tab-pane label="付款条件" name="3">
            <el-form ref="spt" :model="spt" label-width="120px" inline label-position="right" size="small" :rules="sptRules">
              <el-form-item label="默认报价类型" prop="paymentType">
                <el-radio-group v-model="spt.paymentType">
                  <el-radio :label="1">FOB</el-radio>
                  <el-radio :label="2">CIF</el-radio>
                  <!--                  <el-radio :label="3">EXW</el-radio>-->
                </el-radio-group>
              </el-form-item>
              <el-form-item label="到货港口/地址" prop="sendPortBId">
                <el-input v-model="spt.sendPortBId" placeholder="到货港口/地址" class="form-dialog-width" style="width: 230px"/>
                <!--              <el-select v-model="spt.sendPortBId" disabled placeholder="送货港口">-->
                <!--                <el-option v-for="(item, index) in portList" :label="item.label" :value="item.bid" :key="index"></el-option>-->
                <!--              </el-select>-->
              </el-form-item>
              <el-form-item label="付款方式" prop="paymentMethod">
                <el-select v-model="spt.paymentMethod" clearable placeholder="付款方式">
                  <el-option label="T/T" :value="1"></el-option>
                  <el-option label="L/C" :value="2"></el-option>
                  <el-option label="P/A" :value="3"></el-option>
                  <el-option label="D/A" :value="4"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="装运方式" prop="shipmentTypeArr">
                <el-checkbox-group v-model="spt.shipmentTypeArr" @change="getCheckBoxVal">
                  <el-checkbox label="1">汽运</el-checkbox>
                  <el-checkbox label="2">铁路</el-checkbox>
                  <el-checkbox label="3">海运</el-checkbox>
                  <el-checkbox label="4">空运</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
<!--              <el-form-item label="币种" prop="accountCurrency">-->
<!--                <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="bankForm.currencyCode" clearable placeholder="币种中文名或者币种编码" class="form-dialog-width">-->
<!--                  <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index">-->
<!--                  </el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
              <el-form-item label="付款条件:">
                <table border="0" cellspacing="0" cellpadding="0" class="form-table" style="width: 700px">
                  <thead>
                  <tr>
                    <th>序号</th>
                    <th>付款节点</th>
                    <th>默认付款比例</th>
                    <th>付款时间</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, index) in controlTowerList" :key="index">
                    <td>{{index + 1}}</td>
                    <td>{{item.nodeName}}</td>
                    <td>
                      <el-input v-model.number="item.paymentRatio" type="number" clearable style="width: 200px" >
                        <template slot="append">%</template>
                      </el-input>
                    </td>
                    <td>
                      <el-input v-model.number="item.dayNum" type="number" :min="0" :precision="0" clearable style="width: 200px" >
                        <template slot="append">天</template>
                      </el-input>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4" v-if="!controlTowerList.length">暂无数据</td>
                  </tr>
                  </tbody>
                </table>
              </el-form-item>
              <div style="text-align: center">
                <el-form-item>
                  <el-button type="primary" size="small" :loading="confirmLoading" @click="savePayment('spt')">保存</el-button>
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>
          <!--合作详情-->
          <el-tab-pane label="合作关系" name="4">
            <el-form ref="cooperObj" :model="cooperObj" label-width="120px" inline label-position="right" size="small">
              <el-form-item label="合作模式">
                <el-select v-model="cooperObj.cooperMode" clearable placeholder="合作模式">
                  <el-option v-for="(item, index) in cooperTypeList" :label="item.label" :value="item.label" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="起止时间">
                <el-date-picker
                  @change="getRangeTime"
                  v-model="cooperObj.rangeTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="合作协议">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="uploadActionUrl"
                  :headers="upLoadHeaders"
                  :on-success="handleSuccess"
                  :on-remove="handleRemove"
                  :limit="1"
                  :before-upload="beforeUpload"
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传word/pdf，且不超过10M</div>
                </el-upload>
              </el-form-item>
            </el-form>
            <div class="divleft">
              <el-button type="primary" size="mini" @click="addPactFileList">添加</el-button>
              <!--<el-button type="primary" size="mini" class="export">查看协议</el-button>-->
              <!--<el-button type="primary" size="mini">上传协议</el-button>-->
              <!--<el-button type="primary" size="mini">下载协议</el-button>-->
            </div>
            <el-table
              :data="scplist"
              border
              fit
              style="margin: 10px 0"
              size="small"
              :header-cell-style="{background: '#a7bfee'}">

              <el-table-column align="center" label="合作模式" prop="cooperMode" show-overflow-tooltip />

              <el-table-column align="center" label="起止时间" prop="beginTime" show-overflow-tooltip >
                <template slot-scope="scope">
                  {{scope.row.beginTime | timeFmt}}-{{scope.row.endTime | timeFmt}}
                </template>
              </el-table-column>

              <el-table-column align="center" label="协议名称" prop="pactFile" show-overflow-tooltip />
              <el-table-column align="center" label="操作" >
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" class="export" @click="exportPactFile(scope.row)">下载协议</el-button>
                  <el-button type="primary" size="mini" @click="removeFile(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!--联系人-->
          <el-tab-pane label="联系人" name="5">
            <div class="divleft">
              <el-button type="primary" size="mini" @click="addLinkModal()">新增</el-button>
              <el-button type="warning" size="mini" @click="addFromUserList">从用户列表新增</el-button>
            </div>
            <el-table
              :data="sclist"
              border
              fit
              style="margin: 10px 0"
              size="small"
              :header-cell-style="{background: '#a7bfee'}">

              <el-table-column align="center" label="联系人姓名" show-overflow-tooltip >
                <template slot-scope="scope">
                  <a href="javascript:void (0)">{{scope.row.contactName}}</a>
                </template>
              </el-table-column>

              <el-table-column align="center" label="电话" prop="contactPhone" show-overflow-tooltip />

              <el-table-column align="center" label="账号" prop="emailAddress" show-overflow-tooltip />

              <el-table-column align="center" label="职务" prop="customerJob" show-overflow-tooltip />

              <el-table-column align="center" label="操作" >
                <template slot-scope="scope">
                  <!--<el-button type="primary" size="mini" v-if="!scope.row.accountBId" @click="addLinkModal(scope.row)">编辑</el-button>-->
                  <el-button type="primary" size="mini" @click="deleteLinkPeople(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-dialog
            width="600px"
            center
            title="从用户列表新增联系人"
            :close-on-click-modal="false"
            :visible.sync="selectLinkVisible"
            append-to-body>
            <div class="search-box">
              用户信息：
              <el-input v-model="userListPrams.searchKey" clearable placeholder="请输入用户账号/姓名/公司的任意一种" size="mini" class="form-dialog-width" />
              <el-button type="primary" size="small" class="export" @click="getSelectUserList">搜索</el-button>
            </div>
            <el-table
              ref="multipleTable"
              :data="linkList"
              border
              fit
              highlight-current-row
              style="margin: 10px 0"
              size="small"
              @selection-change="singleSelectUser"
              :header-cell-style="{background: '#a7bfee'}">

              <el-table-column
                label="序号"
                type="selection"
                width="50">
              </el-table-column>

              <el-table-column
                label="序号"
                type="index"
                width="50">
              </el-table-column>

              <el-table-column align="center" label="姓名" prop="linkName" show-overflow-tooltip >
                <template slot-scope="scope">
                  {{scope.row.lastName}}{{scope.row.firstName}}
                </template>
              </el-table-column>

              <el-table-column align="center" label="电话" prop="mobilePhone" show-overflow-tooltip />

              <el-table-column align="center" label="账号" prop="emailAddress" show-overflow-tooltip />

              <el-table-column align="center" label="公司" prop="companyName" show-overflow-tooltip />

            </el-table>

            <Pagination :total="userListPrams.total" :page.sync="userListPrams.pageIndex" :limit.sync="userListPrams.pageSize" @pagination="getSelectUserList" />

            <div slot="footer" class="dialog-footer">
              <el-button type="primary" size="small" @click="addLinkFromList">确定</el-button>
              <el-button type="danger" size="small" @click="selectLinkVisible=false">取消</el-button>

            </div>
          </el-dialog>

          <el-dialog
            width="800px"
            center
            title="新增联系人"
            :close-on-click-modal="false"
            :visible.sync="addLinkVisible"
            append-to-body>
            <el-form ref="linkForm" :model="linkForm" label-width="100px" label-position="right" size="small" :rules="linkFormRules">
              <el-row :gutter="28">
                <el-col :span="16">
                  <el-form-item label="账号" prop="userAccount">
                    <el-input v-model="linkForm.userAccount" clearable placeholder="请输入账号"/>
                  </el-form-item>
                  <el-form-item label="名" prop="firstName">
                    <el-input v-model="linkForm.firstName" clearable placeholder="请输入名"/>
                  </el-form-item>
                  <el-form-item label="姓" prop="lastName">
                    <el-input v-model="linkForm.lastName" clearable placeholder="请输入姓"/>
                  </el-form-item>
                  <el-form-item label="性别" prop="userSex">
                    <el-radio-group v-model="linkForm.userSex">
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <div class="avatar">
                    <el-upload
                      class="avatar-uploader"
                      :action="uploadActionUrl"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload">
                      <img v-if="linkForm.photoPath" :src="linkForm.photoPath" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div style="font-size: 10px;text-align: center;color: #ff3a3d;padding: 5px 0;">点击头像进行更换</div>
                  </div>
                </el-col>
              </el-row>
              <el-form-item label="邮箱" prop="emailAddress">
                <el-input v-model="linkForm.emailAddress" clearable placeholder="请输入用户邮箱"/>
              </el-form-item>
              <el-form-item label="地址" prop="contactAddress">
                <el-input v-model="linkForm.contactAddress" clearable placeholder="请输入地址"/>
              </el-form-item>
              <el-row :gutter="28">
                <el-col :span="12">
                  <el-form-item label="直线号码" prop="officePhone">
                    <el-input v-model="linkForm.officePhone" :min="0" clearable placeholder="请输入直线号码"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="电话分机" prop="officePhone2">
                    <el-input v-model="linkForm.officePhone2" :min="0" clearable placeholder="请输入电话分机"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号码1" prop="mobilePhone">
                    <el-input v-model="linkForm.mobilePhone" :min="0" clearable placeholder="请输入用户手机号码"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号码2" prop="mobilePhone2">
                    <el-input v-model="linkForm.mobilePhone2" :min="0" clearable placeholder="请输入用户手机号码2"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="常用语言" prop="usedLanguage">
                    <el-select v-model="linkForm.usedLanguage" clearable placeholder="请选择语言" style="width: 100%" @change="setOtherList">
                      <el-option v-for="(item, index) in languageList" :label="item.label" :value="item.id" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="其他语言" prop="preferedLanguageStr">
                    <el-select v-model="linkForm.preferedLanguageStr" multiple placeholder="请选择语言,多选." style="width: 100%" @change="getcommLanguage1">
                      <el-option v-for="(item, index) in languageList1" :label="item.label" :value="item.id" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="国家" prop="countryCode">
                <el-select filterable remote :remote-method="getCountryList" :loading="loading1"
                           v-model="linkForm.countryCode" clearable placeholder="请输入国家中文名或者英文名" style="width: 100%">
                  <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.chEnName" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="公司名称" prop="companyName">
                <el-input v-model="linkForm.companyName" disabled placeholder="请输入公司名称"/>
              </el-form-item>
              <el-form-item label="职位" prop="position">
                <el-input v-model="linkForm.position" clearable placeholder="请输入公司职位"/>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" size="small" @click="addLinkPeople('linkForm')">确定</el-button>
              <el-button type="danger" size="small" @click="addLinkVisible=false">取消</el-button>

            </div>
          </el-dialog>
          <!--服务人员-->
          <el-tab-pane label="服务人员" name="6">
            <div class="divleft">
              <el-button type="primary" size="mini" @click="addServiceModal">新增</el-button>
            </div>
            <el-table
              :data="sslist"
              border
              fit
              style="margin: 10px 0"
              size="small"
              :header-cell-style="{background: '#a7bfee'}">

              <el-table-column align="center" label="姓名" prop="servingName" show-overflow-tooltip />

              <el-table-column align="center" label="职位" prop="csJob" show-overflow-tooltip />

              <el-table-column align="center" label="操作" >
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="deleteService(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-dialog
            width="600px"
            center
            title="新增服务人员"
            :close-on-click-modal="false"
            :visible.sync="addServiceVisible"
            append-to-body>
            <el-form ref="serviceForm" :model="serviceForm" label-width="100px" label-position="right" size="small" :rules="serviceFormRules">
              <el-form-item label="姓名" prop="accountBId">
                <el-select
                  v-model="serviceForm.accountBId"
                  remote
                  :remote-method="getAccountUserList"
                  clearable
                  filterable
                  placeholder="请输入姓或名进行搜索"
                  class="form-dialog-width">
                  <el-option v-for="(item, index) in accountUserListSelect" :label="item.userName" :value="item.accountBId" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="职位" prop="csJob">
                <el-select v-model="serviceForm.csJob" clearable class="form-dialog-width">
                  <el-option value="客服员"></el-option>
                  <el-option value="采购专员"></el-option>
                  <el-option value="采购经理"></el-option>
                  <el-option value="技术经理"></el-option>
                  <el-option v-for="(item, index) in jobList" :value="item.jobName" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" size="small" @click="addServicePeople('serviceForm')">确定</el-button>
              <el-button type="danger" size="small" @click="addServiceVisible=false">取消</el-button>

            </div>
          </el-dialog>

          <!--客户商品类目-->
          <el-tab-pane label="商品类目" name="7">
            <div class="category-form">
              <div>选择可售和更多的可见商品</div>
              <div>
                可见价格梯度：
                <el-select v-model="categoryForm.gradientBId" clearable placeholder="select" style="width: 200px">
                  <el-option v-for="(item, index) in gradientList" :label="item.name" :value="item.id" :key="index"></el-option>
                </el-select>
              </div>
            </div>
            <el-table
              style="width:90%;margin: 10px auto"
              :data="categoryList"
              border
              fit
              size="mini"
              row-key="id"
              max-height="500"
              :header-cell-style="{background: '#a7bfee'}">

              <el-table-column
                align="center"
                type="index"
                width="55">
              </el-table-column>

              <el-table-column header-align="center" label="类目编码/名称">
                <template slot-scope="scope">
                  {{scope.row.catalogCode}}/{{scope.row.catalogName}}
                </template>
              </el-table-column>

              <el-table-column align="center" label="商品数量" prop="bankName" />

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <el-checkbox v-model="checked1" @change="checkAll1">全选</el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.check">可售</el-checkbox>
                </template>
              </el-table-column>

              <el-table-column align="center" label="默认账户" prop="defaultValue">
                <template slot="header" slot-scope="scope">
                  <el-checkbox v-model="checked2" @change="checkAll2">全选</el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.check2">更多</el-checkbox>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align: center">
              <el-button type="primary" size="small" :loading="confirmLoading" @click="saveProductCategory()">保存</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      <!--<div slot="footer" class="dialog-footer" style="border-top: 1px solid #f4f4f4">-->
        <!--&lt;!&ndash;<el-button type="primary" size="small" :loading="confirmLoading" @click="saveBasicMsg()">保存</el-button>&ndash;&gt;-->
        <!--<el-button type="danger" size="small" @click="editVisible=false">关闭</el-button>-->
      <!--</div>-->
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  listCustomerInfo,
  saveCustomerInfo,
  updateCustomerInfo,
  getCustomerInfoByBId,
  listSort,
  deleteCustomer,
  listCustomerBank,
  saveCustomerBank,
  updateCustomerBank,
  deleteCustomerBankByIds,
  getPaymentDetailByBId,
  saveCustomerPaymentTerms,
  updateCustomerPaymentTerms,
  listCustomerCooperPact,
  saveCustomerCooperPact,
  deleteCustomerCooperPact,
  listCustomerContact,
  saveCustomerContact,
  // updateCustomerContact,
  deleteCustomerContact,
  listCustomerServing,
  saveCustomerServing,
  deleteCustomerServing,
  exportCustomer,
  getCustomerCategory,
  saveCustomerCategory
} from '@/api/customer';
import { listMemberLevel } from '@/api/member'
import { uploadActionUrl } from '@/api/common';
import { selectCountryListApi, selectCurrencyCodeListApi } from '@/api/system'
import { getClientUserList, getAdminUserList, selectUserListAllApi, addLinkUser } from '@/api/user'
import { getToken } from '@/utils/auth'
import { parseTime, deepClone } from '@/utils/index'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      currencyCodeList: [],
      uploadActionUrl,
      activeName: '1',
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
      gradeDataRules: {
        customerName: [
          { required: true, message: '请填写客户名称', trigger: 'blur' }
        ],
        customerCode: [
          { required: true, message: '请填写客户编码', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请填写公司名称', trigger: 'blur' }
        ],
        countryCode: [
          { required: true, message: '请选择国家', trigger: 'change' }
        ],
        postalCode: [
          {
            pattern: /^\d+(\.{1}\d+)?$/,
            message: "邮政编码为数字"
          }
        ],
        emailAddress: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        // officePhone: [
        //   {
        //     pattern: /^\d{3}-\d{8}|\d{4}-\d{7}$/,
        //     message: "固定电话号码格式：0312-3614072"
        //   }
        // ],
        // officePhone2: [
        //   {
        //     pattern: /^\d{3}-\d{8}|\d{4}-\d{7}$/,
        //     message: "固定电话号码格式：0312-3614072"
        //   }
        // ],
        // mobilePhone: [
        //   {
        //     pattern: /^[1][358]\d{9}$/,
        //     message: "请输入正确格式的电话号码，"
        //   }
        // ],
        // mobilePhone2: [
        //   {
        //     pattern: /^[1][358]\d{9}$/,
        //     message: "请输入正确格式的电话号码，"
        //   }
        // ],
        // facsimileNo: [
        //   {
        //     pattern: /^(\d{3,4}-)?\d{7,8}$/,
        //     message: "传真格式为:XXX-12345678或XXXX-1234567",
        //     trigger: 'blur'
        //   }
        // ],
        // facsimileNo2: [
        //   {
        //     pattern: /^(\d{3,4}-)?\d{7,8}$/,
        //     message: "传真格式为:XXX-12345678或XXXX-1234567",
        //     trigger: 'blur'
        //   }
        // ],
        taxNo: [
          {
            pattern: /^\w+$/,
            message: "请输入正确的税号",
            trigger: 'blur'
          }
        ],
        chargeBy: [
          { required: true, message: '请填写负责人', trigger: 'blur' }
        ],
        deliveryPortArr: [
          { type: 'array', required: true, message: '请填写港口', trigger: 'change' }
        ],
        commLanguageList: [
          { type: 'array', required: true, message: '请选择常用语言', trigger: 'change' }
        ],
        preferredLanguage: [
          { required: true, message: '请选择常用语言', trigger: 'change' }
        ],
        memberBId: [
          { required: true, message: '请选择客户等级', trigger: 'change' }
        ],
        customerStatus: [
          { required: true, message: '请选择客户状态', trigger: 'blur' }
        ],
        sortName: [
          { type: 'array', required: true, message: '请选择客户分类', trigger: 'change' }
        ]
      },
      controlTowerList: [],
      spt: {
        paymentMethod: '',
        shipmentTypeArr: [],
        shipmentType: '',
        paymentType: '',
        sendPortBId: ''
      },
      sptRules: {
        sendPortBId: [{ required: true, message: '请填写到货港口', trigger: 'change' }],
        shipmentTypeArr: [{ type: 'array', required: true, message: '请选择供应商分类', trigger: 'change' }],
        paymentMethod: [{ required: true, message: '请选择付款条件', trigger: 'change' }],
        paymentType: [{ required: true, message: '请选报价类型', trigger: 'change' }]
      },
      // 银行列表
      sbalist: [],
      // sbalist: [{ bankAccount: '', bankName: '', reservedPhone: '', swiftCode: '' }],
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
      linkFormRules: {
        userAccount: [
          { required: true, message: '请填写账号', trigger: 'blur' }
        ],
        firstName: [
          { required: true, message: '请填写名字', trigger: 'blur' }
        ],
        lastName: [
          { required: true, message: '请填写姓氏', trigger: 'blur' }
        ],
        emailAddress: [
          { required: true, message: '请填写邮箱', trigger: 'blur' }
        ],
        contactAddress: [
          { required: true, message: '请填写联系地址', trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, message: '请填写手机号', trigger: 'blur' }
        ],
        officePhone: [
          { required: true, message: '请填写直线电话', trigger: 'blur' }
        ],
        countryCode: [
          { required: true, message: '请填写名字', trigger: 'change' }
        ],
        usedLanguage: [
          { required: true, message: '请选择常用语言', trigger: 'change' }
        ]
      },
      serviceForm: {
        accountBId: '',
        accountName: '',
        csJob: '客服人员'
      },
      serviceFormRules: {
        accountBId: [
          { required: true, message: '请填写联系人姓名', trigger: 'change' }
        ],
        csJob: [
          { required: true, message: '请选择职位', trigger: 'change' }
        ]
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
      bankFormRules: {
        bankAccount: [
          { required: true, message: '请填写开户银行', trigger: 'blur' }
        ],
        bankName: [
          { required: true, message: '请填写开户银行', trigger: 'blur' }
        ],
        branchName: [
          { required: true, message: '请填写支行名称', trigger: 'blur' }
        ],
        bankAddress: [
          { required: true, message: '请填写银行地址', trigger: 'blur' }
        ],
        reservedPhone: [
          { required: true, message: '请填写预留电话', trigger: 'blur' }
        ],
        swiftCode: [
          { required: true, message: '请填写swiftCode编码', trigger: 'blur' }
        ],
        accountCurrency: [
          { required: true, message: '请选择币种', trigger: 'change' }
        ]
      },
      userListPrams: {
        pageSize: 10,
        total: 0,
        pageIndex: 1,
        searchKey: ''
      },
      selectLinkPeople: [],
      gradientList: [
        {
          id: '1',
          name: '梯度1'
        },
        {
          id: '2',
          name: '梯度1'
        },
        {
          id: '3',
          name: '梯度1'
        },
        {
          id: '4',
          name: '梯度1'
        },
        {
          id: '5',
          name: '梯度5'
        }
      ],
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
      reviewForm: {
        idlist: '',
        customerStatus: 0
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
      customerStatus: [],
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
    this.getCurrencyCodeListFun()
  },
  methods: {
    addCustomerRecord(id, customerName) {
      this.$router.push({
        query: {
          id, customerName
        },
        path: '/customer/communicationRecord'
      })
    },
    clearDialog() {
      this.$refs['customerData'].resetFields();
      this.customerData.bid = '';
      this.customerData.ownField = '';
      this.customerData.deliveryPort = '';
      this.customerData.ownFielList = [];
      this.customerData.commLanguageList = [];
      // this.customerData = [];
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
    // 点击切换tabs
    changeTabs(name) {
      if (name !== '1' && !this.customerData.bid) {
        this.$message.warning('需要完善 基础信息,才能填写其他信息!');
        return false
      }
      switch (Number(name)) {
        case 2: this.getCustomerBankList(); break;
        case 3: this.getPayments(); break;
        case 4: this.getCooperFile(); break;
        case 5: this.getLinkPeople(); break;
        case 6: this.getServiceList(); break;
        case 7: this.getCustomerCategoryList(); break;
        default: break;
      }
    },
    // 获取银行卡列表
    getCustomerBankList() {
      listCustomerBank({ customerBId: this.customerData.bid, pageNum: 1, pageSize: 999 }).then(res => {
        this.sbalist = res.data.list;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取付款信息
    getPayments() {
      getPaymentDetailByBId({ customerBId: this.customerData.bid }).then(res => {
        this.spt = Object.assign(this.spt, res.data);
        if (res.data.customerOrderPayNodeList && res.data.customerOrderPayNodeList.length) {
          this.spt.shipmentTypeArr = res.data.shipmentType ? res.data.shipmentType.split(',') : [];
          this.firstPayment = false;
          this.controlTowerList = res.data.customerOrderPayNodeList || []
        } else {
          this.controlTowerList = (res.data.controlTowerList || []).map(e => {
            e.dayNum = 0;
            e.paymentRatio = 0;
            e.customerBId = this.customerData.bid;
            e.controlNodeBId = e.bid;
            e.nodeLevel = e.sequence;
            return { ...e }
          });
          this.firstPayment = true;
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 保存付款信息
    savePayment(formName) {
      if (this.totalSum !== 100) {
        return this.$message.warning('付款比例总数只能为100')
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = this.firstPayment ? saveCustomerPaymentTerms : updateCustomerPaymentTerms;
          this.confirmLoading = true;
          this.spt.customerBId = this.customerData.bid;
          this.spt.customerOrderPayNodeList = this.controlTowerList;
          api(this.spt).then(res => {
            this.$message.success('保存成功');
            this.firstPayment = false;
            this.confirmLoading = false;
          }).catch(err => {
            this.$message.error(err.message);
            this.confirmLoading = false;
          });
        } else {
          return this.$message.warning('请填写完整');
        }
      });
    },
    // 获取合作协议列表
    getCooperFile() {
      listCustomerCooperPact({ customerBId: this.customerData.bid, pageNum: 1, pageSize: 999 }).then(res => {
        this.scplist = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取联系人列表
    getLinkPeople() {
      listCustomerContact({ customerBId: this.customerData.bid }).then(res => {
        this.sclist = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取服务人员列表
    getServiceList() {
      listCustomerServing({ pageNum: 1, pageSize: 999, customerBId: this.customerData.bid }).then(res => {
        this.sslist = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取类目商品
    getCustomerCategoryList() {
      getCustomerCategory({ customerBId: this.customerData.bid }).then(res => {
        this.categoryForm = res.data;
        this.categoryList = res.data.productCatalogVos.map(e => {
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message);
      });
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
    saveProductCategory() {
      if (!this.categoryForm.gradientBId) {
        return this.$message.warning('请先选择梯度')
      }
      this.categoryForm.customerBId = this.customerData.bid;
      this.categoryForm.customerProductSpecFormList = this.getSelectCategoryList(this.categoryList).map(e => {
        e.visibleStatus = e.check ? 1 : 0;
        e.visibleType = e.check2 ? 1 : 0;
        e.customerBId = this.customerData.bid;
        e.catalogBId = e.bid;
        return { ... e }
      });
      saveCustomerCategory(this.categoryForm).then(res => {
        console.log(res)
      }).catch(err => {
        this.$message.error(err.message);
      });
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
    // 打开新增编辑弹窗
    openEdit(type, bid) {
      this.activeName = '1';
      if (type === 'edit') {
        let obj = {
          bid: bid
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
      }
      this.dialogType = type;
      this.editVisible = true;
    },
    // 打开详情弹窗
    // 打开详情弹窗
    openDetail(id) {
      this.activeName = '1';
      this.detailVisible = true;
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
        this.getCustomerBankList();
        this.getPayments();
        this.getCooperFile();
        this.getLinkPeople();
        this.getServiceList();
        this.getCustomerCategoryList();
      }).catch(err => {
        this.$message.error(err.message);
      });
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
    // 从用户列表添加联系人
    addLinkFromList() {
      if (!this.selectLinkPeople.length) {
        return this.$message.error('请选择用户添加')
      }
      if (this.selectLinkPeople.length !== 1) {
        return this.$message.error('一次只能添加一个用户')
      }
      let obj = {
        accountBId: this.selectLinkPeople[0].accountBId,
        contactName: this.selectLinkPeople[0].lastName + ' ' + this.selectLinkPeople[0].firstName,
        contactPhone: this.selectLinkPeople[0].mobilePhone,
        emailAddress: this.selectLinkPeople[0].emailAddress,
        customerJob: '',
        customerBId: this.customerData.bid
      };
      // this.sclist.push(deepClone(obj));
      saveCustomerContact(deepClone(obj)).then(res => {
        this.$message.success('保存成功')
        this.getLinkPeople();
        this.selectLinkPeople = [];
        this.$refs.multipleTable.clearSelection();
        this.selectLinkVisible = false
      }).catch(err => {
        this.$message.warning(err.message);
      });
    },
    // 打开新增联系人弹窗
    addLinkModal(type) {
      this.linkForm.companyName = this.customerData.companyName;
      this.addLinkVisible = true;
    },
    // 新增联系人
    addLinkPeople(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.linkForm.businessBid = this.customerData.bid;
          addLinkUser(this.linkForm).then(res => {
            this.$message.success('保存成功')
            this.$refs[formName].resetFields();
            this.linkForm.photoPath = '';
            this.getLinkPeople();
            this.addLinkVisible = false
          }).catch(err => {
            this.$message.warning(err.message);
          })
        } else {
          return this.$message.warning('请填写完整');
        }
      });
    },
    // 删除联系人
    deleteLinkPeople(row) {
      deleteCustomerContact({ id: row.id }).then(res => {
        this.$message.success('删除成功');
        this.getLinkPeople();
      }).catch(err => {
        this.$message.warning(err.message);
      })
    },
    // 新增服务人员
    addServicePeople(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.serviceForm.customerBId = this.customerData.bid;
          saveCustomerServing(this.serviceForm).then(res => {
            this.$message.success('新增成功');
            this.$refs[formName].resetFields();
            this.getServiceList();
            this.addServiceVisible = false
          }).catch(err => {
            this.$message.warning(err.message);
          })
        } else {
          return this.$message.warning('请填写完整');
        }
      });
    },
    // 删除服务人员
    deleteService(row) {
      deleteCustomerServing({ id: row.id }).then(res => {
        this.$message.success('删除成功');
        this.getServiceList();
      }).catch(err => {
        this.$message.warning(err.message);
      })
    },
    // 打开服务人员弹窗
    addServiceModal() {
      this.addServiceVisible = true
    },
    // 查询获取币种
    getCurrencyCodeList(query) {
      if (query !== '') {
        this.loading2 = true;
        setTimeout(() => {
          this.loading2 = false;
          selectCurrencyCodeListApi(query).then(res => {
            this.currencyCodeList = res.data || []
          })
        }, 200);
      } else {
        this.currencyCodeList = [];
      }
    },
    // 获取币种列表
    getCurrencyCodeListFun() {
      selectCurrencyCodeListApi().then(res => {
        this.currencyCodeList = res.data || [];
      });
    },
    // 新增银行账号
    addBankAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.bankForm.customerBId = this.customerData.bid;
          let api = this.bankDialogType === 'add' ? saveCustomerBank : updateCustomerBank;
          api(this.bankForm).then(res => {
            this.$refs[formName].resetFields();
            this.getCustomerBankList();
            this.addBankVisible = false
          }).catch(err => {
            this.$message.error(err.message)
          })
        } else {
          return this.$message.warning('请填写完整');
        }
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
    // 删除银行账户
    removeBankAccount() {
      if (!this.bankSelectList.length) {
        return this.$message.warning('请先选择数据')
      }
      let formData = new FormData();
      formData.append('ids', this.bankSelectList.map(e => e.id).join(','));
      deleteCustomerBankByIds(formData).then(res => {
        this.$message.success('删除成功');
        this.getCustomerBankList();
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    arrSplice(arr, index) {
      arr.splice(index, 1)
    },
    // 把多选框选的值由数组转换为字符串
    getCheckBoxVal(arr) {
      this.spt.shipmentType = arr.join(',')
    },
    // 删除主列表数据，可批量删除
    deleteCustomer(id) {
      let obj = {};
      if (id) {
        obj = {
          bid: id,
          delFlag: 2
        }
      } else {
        if (!this.selectList.length) {
          return this.$message.error('请先选择数据');
        }
        obj = {
          bid: this.selectList.map(e => e.bid).join(','),
          delFlag: 2
        }
      }
      this.$confirm('是否确定删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteCustomer(obj).then(res => {
          if (res.status === 200) {
            this.$message.success('操作成功');
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
      });
    },
    // 保存基础信息
    saveBasicMsg(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          this.customerData.ownField = this.customerData.ownFieldString;
          this.customerData.commLanguage = this.customerData.commLanguageString;
          if (this.customerData.bid) {
            updateCustomerInfo(this.customerData).then(res => {
              this.$message.success('保存成功');
              this.postData.pageNum = 1;
              this.getDataList();
              // this.editVisible = false;
              this.confirmLoading = false;
            }).catch(err => {
              this.confirmLoading = false;
              this.$message.error(err.message);
            });
          } else {
            this.customerData.ownField = this.customerData.ownFieldString;
            this.customerData.commLanguage = this.customerData.commLanguageString;
            saveCustomerInfo(this.customerData).then(res => {
              this.$message.success('新增成功');
              this.customerData.bid = res.data;
              this.postData.pageNum = 1;
              this.getDataList();
              // this.editVisible = false;
              this.confirmLoading = false;
            }).catch(err => {
              this.confirmLoading = false;
              this.$message.error(err.message);
            });
          }
        } else {
          this.$message.warning('验证未通过')
          return false;
        }
      });
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
    // 新增协议
    addPactFileList() {
      if (!this.cooperObj.cooperMode || !this.cooperObj.rangeTime || !this.cooperObj.pactFile) {
        return this.$message.warning('请填写完整和上传文件');
      }
      // this.scplist.push({ ...this.cooperObj });
      this.cooperObj.customerBId = this.customerData.bid
      saveCustomerCooperPact(this.cooperObj).then(res => {
        this.$message.success('新增成功');
        this.cooperObj.cooperMode = '';
        this.cooperObj.beginTime = '';
        this.cooperObj.endTime = '';
        this.cooperObj.rangeTime = null;
        this.cooperObj.pactFile = '';
        this.cooperObj.pactFileUuid = '';
        this.cooperObj.pactFilePath = '';
        this.$refs.upload.clearFiles();
        this.getCooperFile()
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 删除协议
    removeFile(scope) {
      deleteCustomerCooperPact({ id: scope.row.id }).then(res => {
        this.$message.success('删除成功');
        this.getCooperFile()
      }).catch(err => {
        this.$message.error(err.message)
      });
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
    },
    // 下载协议
    exportPactFile(row) {
      window.open(row.pactFilePath)
    },
    // 上传文件删除
    handleRemove(file, fileList) {
      this.cooperObj.pactFile = '';
      this.cooperObj.pactFileUuid = '';
      this.cooperObj.pactFilePath = '';
    },
    // 上传成功
    handleSuccess(res, file, filename) {
      this.cooperObj.pactFile = file.name;
      this.cooperObj.pactFileUuid = res.data.UUID;
      this.cooperObj.pactFilePath = res.data.filePath;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制为 1 个文件`);
    },
    // 上传之前限制
    beforeUpload(file) {
      //
      for (let i = 0; i < this.scplist.length; i++) {
        if (this.scplist[i].pactFile === file.name) {
          this.$message.error('已有文件不能重复上传');
          return false
        }
      }
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension = testmsg === 'PDF';
      const extension2 = testmsg === 'pdf';
      const extension3 = testmsg === 'doc';
      const extension4 = testmsg === 'docx';
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension && !extension2 && !extension3 && !extension4) {
        this.$message({
          message: '上传文件只能是 PDF、doc、docx格式!',
          type: 'warning'
        });
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 10MB!',
          type: 'warning'
        });
      }
      return extension || extension2 || extension3 || extension4 && isLt2M
    },
    handleAvatarSuccess(res, file) {
      this.linkForm.photoPath = res.data.filePath;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt3M) {
        this.$message.error('上传头像图片大小不能超过 3MB!');
      }
      return isJPG && isLt3M;
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val, '{y}-{m}-{d}')
      }
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
