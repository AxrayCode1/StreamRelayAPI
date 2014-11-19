var UILogControl = {
    createNew:function(oInputHtml,oInputRelayAjax){
        var oHtml = oInputHtml;
        var oRelayAjax = oInputRelayAjax;                        
        var oUILogContorl={};
        var oError = {};
        oUILogContorl.Init = function(){   
            oError = ErrorHandle.createNew();
            $('#el').click(function() {
                oHtml.HideAllOption();
                oHtml.ShowOption(DivSystemLog);
                oUILogContorl.ListLog();
            }); 
            $('#btn_log_refresh').click(function(event){
                event.preventDefault(); 
                oUILogContorl.ListLog();
            });
            $('.logth').click(function(){
               var th = $(this);
               var eSortType = SortType.String;
               var eSortDirection = SortDirection.ASC;               
               if(th.hasClass('asc')){
                   th.removeClass('asc');
                   th.addClass('desc');
                   eSortDirection = SortDirection.Desc;
               }
               else{
                   th.removeClass('desc');
                   th.addClass('asc');
                   eSortDirection = SortDirection.ASC;
               }
               SortLogList(eSortDirection,eSortType,th.attr('id'));
               oHtml.clearLogTable();
               oHtml.appendLogTablebyList();      
            });
        };      
        
        function SortLogList(eSortDirection,eSortType,sSortVariable)
        {                    
            switch ( eSortDirection )
            {
                case SortDirection.ASC:
                    switch(eSortType)
                    {
                        case SortType.Num:
                            LogList.sort(function(a,b)
                            {	
                                return (a[sSortVariable] - b[sSortVariable]);
                            });
                            break;
                        case SortType.String:
                            LogList.sort( function(a,b)
                            {                                
                                return a[sSortVariable].toUpperCase() < b[sSortVariable].toUpperCase() ? -1 : ( a[sSortVariable].toUpperCase() > b[sSortVariable].toUpperCase() ? 1 : 0 );
                            });
                            break;
                    }
                    break;

                case SortDirection.Desc:
                    switch(eSortType)
                    {
                        case SortType.Num:
                            LogList.sort( function(a,b)
                            {
                                return (b[sSortVariable] - a[sSortVariable]);
                            });
                            break;
                        case SortType.String:
                            LogList.sort( function(a,b)
                            {                               
                                return a[sSortVariable].toUpperCase() > b[sSortVariable].toUpperCase() ? -1 : ( a[sSortVariable].toUpperCase() < b[sSortVariable].toUpperCase() ? 1 : 0 );
                            });
                            break;
                    }
                    break;               
            }          
        }      
        
        oUILogContorl.ListLog = function(){
            oHtml.blockPage();
            var request = oRelayAjax.listlog();
            oUILogContorl.CallBackListLog(request);
        };     
        
        oUILogContorl.CallBackListLog = function(request){            
            request.done(function(msg, statustext, jqxhr) {
                oHtml.stopPage();                
                oHtml.clearLogTable();
                oHtml.appendLogTable(msg);            
            });
            request.fail(function(jqxhr, textStatus) {
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.ListLog);
            });
        };
       
        return oUILogContorl;
    }
};


