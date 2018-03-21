/**
 *@JSname:客源组管理
 */
~(function () {
  "use strict";
  $('#tab_source_group').datagrid({
    title: '客源组列表', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    striped: true,//隔行变色
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    url: '../sourcegroup/pglist',
    queryParams: { offset: 0, limit: 9999, groupName: "" },
    columns: [[
      { field: 'sourceGroupName', title: '客源组名称', width: 20, align: 'center' },
      { field: 'createTime', title: '创建时间', width: 20, hidden: true },
      { field: 'creator', title: '创建者', width: 20, hidden: true },
      { field: 'hotelId', title: '宾馆ID', width: 20, hidden: true },
      { field: 'sortCode', title: 'sortCode', width: 20, hidden: true },
      { field: 'source', title: 'source', width: 20, hidden: true },
      { field: 'sourceGroupId', title: 'sourceGroupId', width: 20, hidden: true }
    ]]
  });
})();