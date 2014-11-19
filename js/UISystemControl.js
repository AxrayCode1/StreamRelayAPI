var UISystemControl = {
    createNew:function(oInputHtml,oInputRelayAjax){
        var oHtml = oInputHtml;
        var oRelayAjax = oInputRelayAjax;                        
        var oUISystemContorl={};
        var oError = {};
        var GetTimeInterval;
        var Senconds;
        oUISystemContorl.Init = function(){   
            oError = ErrorHandle.createNew();
            InitSystemTab();
            InitDatePicker();
            InitTimeCombo();
            $('#btnupdate').button();
            $('#ss').click(function(event) {
                event.preventDefault();
                ClearPassword();                
                oHtml.HideAllOption();
                oHtml.ShowOption(DivSystem);                
                $('#tab-container').easytabs('select', '#tabs1-password');
                ListTime(true);
            });            
            $('#btn_clear_pwd').click(function(event){
                event.preventDefault();
                ClearPassword();
            });
            $('#btn_chg_pwd').click(function(event) {
                event.preventDefault();
                oUISystemContorl.ChangePasswordAction();
            });
            $('#btn_set_time').click(function(event){
                event.preventDefault();
                SetTime();
            });
            $('#btnupdate').click(function(event){
                event.preventDefault();
                UpdateTime();
            });
            $('#btn_reset_time').click(function(event) {
                event.preventDefault();
                ListTime(true);
            });
            $(".radiotime").click(function(event){                
                TimeModeChangeEnableDisableElement();
            });
        };                
        
        function InitTimeCombo(){
            $('#combotimezone').scombobox({
                editAble:false,
                wrap:false
            });
            $('#combohour').scombobox({
                editAble:false,
                wrap:false,
                maxHeight:'150px'
            });
            $('#combomin').scombobox({
                editAble:false,
                wrap:false,
                maxHeight:'150px'
            });
            $('#combosecond').scombobox({
                editAble:false,
                wrap:false,
                maxHeight:'150px'
            });
            $('#combontpserver').scombobox({
                invalidAsValue: true,
                customEdit : true,
                wrap:false
            });
        };     
        
        function InitSystemTab(){
            $('#tab-container').easytabs();
        };
        
        function InitDatePicker(){
            $( "#datepicker" ).datepicker({dateFormat: "yy-mm-dd"});            
        };
        
        function ClearPassword(){
            $('#CurPWD').val('');        
            $('#NewPWD').val('');
            $('#ConfNewPWD').val('');
        };               
        
        oUISystemContorl.ChangePasswordAction = function(){            
            var sCurPWD = $('#CurPWD').val();        
            var sNewPWD = $('#NewPWD').val();
            var sConfirmNewPWD = $('#ConfNewPWD').val();
            if(sCurPWD.length === 0)
            {
                alert('Please input value in Current Password.');
                return false;
            }
            if(sNewPWD.length === 0)
            {
                alert('Please input value in New Password.');
                return false;
            }
            if(sConfirmNewPWD.length === 0)
            {
                alert('Please input value in Confirm New Password.');
                return false;
            }
            if(hex_sha512(sCurPWD)!== oUISystemContorl.GetCookie('CheckKey'))
            {
                alert('Current Password is not right.');
                return false;
            }
            if (sNewPWD.indexOf(' ') !== -1)
            {
                alert("Can't input whitespace in New Password.");
                return false;
            }
            if (sNewPWD.length < 6 || sNewPWD.length > 12)
            {
                alert("New Password's length must be between 6 and 12 chars.");
                return false;
            }
            if(sNewPWD !== sConfirmNewPWD)
            {
                alert('New Password and Confirm New Password are not the same.');
                return false;
            }            
            oUISystemContorl.ChangePassword(sNewPWD);
        };    
        
        oUISystemContorl.ChangePassword=function(sNewPWD)
        {
            var request = oRelayAjax.changepwd(hex_sha512(sNewPWD));
            oUISystemContorl.CallBackChangePassword(request); 
        };
        
        oUISystemContorl.CallBackChangePassword=function(request){
            oHtml.blockPage();            
            request.done(function(msg, statustext, jqxhr) {                  
                oHtml.stopPage();
                alert('Password is modified successful.');
                window.location = '/ui/index.html';
            });            
            request.fail(function(jqxhr, textStatus) {  
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.SystemChangePWD);
            });
        };     
        
        oUISystemContorl.GetCookie=function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)===' ') c = c.substring(1);
                if (c.indexOf(name) !== -1) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        };
        
        function VerifyNtpServer(Input_Data)
        {
            if (Input_Data.length === 0) {
                alert("Error : Please input value in Server Address.");
                return false;
            };  
            var whitespace = " ";
            var sDot = ",";            
            if (Input_Data.indexOf(whitespace) !== -1 || Input_Data.indexOf(sDot) !== -1){
                lert("Error : Can't input whitespace and ',' in Server Address.");
                return false;
            }
            else
                return true;
        };
        
        function SetTime(){
            var mode = 0;
            var time = '';            
            var timezone = $('#combotimezone').scombobox('val');
            var ntpserver = '';
            var check_val = $( ".radiotime:checked" ).val();            
            if(check_val === 'sync'){
                mode =1;
                ntpserver = $('#combontpserver').scombobox('val');
                if(!VerifyNtpServer(ntpserver)){                    
                    return;
                }
            }
            else{               
                var date = $('#datepicker').datepicker({ dateFormat: 'yy-mm-dd' }).val();
                var hour = $('#combohour').scombobox('val'); 
                var min = $('#combomin').scombobox('val'); 
                var second = $('#combosecond').scombobox('val'); 
                time = date + " " + hour + ":" + min + ":" + second;                
            }
            oHtml.blockPage();
            var request = oRelayAjax.SetTime(mode,timezone,time,ntpserver);
            CallBackSetTime(request);       
        };
                        
        function CallBackSetTime(request){
            request.done(function(msg, statustext, jqxhr) {          
                oHtml.stopPage();    
                ListTime(true);
                
            });            
            request.fail(function(jqxhr, textStatus) {   
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.SetTime);
                if(jqxhr.status === 400)
                    ListTime(true);
            });
        }
        
        function UpdateTime(){
            var ntpserver = $('#combontpserver').scombobox('val');  
            if(!VerifyNtpServer(ntpserver)){                
                return;
            }
            oHtml.blockPage();
            var request = oRelayAjax.UpdateTime(ntpserver);
            CallBackUpdateTime(request);       
        };
                        
        function CallBackUpdateTime(request){
            request.done(function(msg, statustext, jqxhr) {          
                oHtml.stopPage();    
                ListTime(false);                
            });            
            request.fail(function(jqxhr, textStatus) {   
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.UpdateNtp);
                if(jqxhr.status === 400)
                    ListTime(false);
            });
        }
        
        function ListTime(bChangeDate){
            oHtml.blockPage();    
            var request = oRelayAjax.ListTime();
            CallBackListTime(request,bChangeDate);             
        };
        
        function CallBackListTime(request,bChangeDate){
            request.done(function(msg, statustext, jqxhr) {          
                oHtml.stopPage();    
                var d=new Date(msg['Time']);
                Senconds= d.getTime();                
                if(typeof(GetTimeInterval) !== 'undefined')
                    clearInterval(GetTimeInterval);
                if(bChangeDate){
                    $('#combotimezone').scombobox('val', msg['TimeZone']);
                }
                if(bChangeDate && msg['Mode'] === 1){
                    $('#raido_sync').prop('checked',true);
                    $('#combontpserver').scombobox('val',msg['NTP']);
                }                    
                SetTimeStrBySenconds(bChangeDate);
                GetTimeInterval = setInterval(function(){SetTimeStrBySenconds(false);}, 1000);
            });            
            request.fail(function(jqxhr, textStatus) {   
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.ListTime);
            });
        };
        
        function SetTimeStrBySenconds(bChangeDate) {            
            var d1=new Date(Senconds);

            var curr_year = d1.getFullYear();

            var curr_month = d1.getMonth() + 1; //Months are zero based
            if (curr_month < 10)
                curr_month = "0" + curr_month;

            var curr_date = d1.getDate();
            if (curr_date < 10)
                curr_date = "0" + curr_date;

            var curr_hour = d1.getHours();
            if (curr_hour < 10)
                curr_hour = "0" + curr_hour;

            var curr_min = d1.getMinutes();
            if (curr_min < 10)
                curr_min = "0" + curr_min;

            var curr_sec = d1.getSeconds();     
            if (curr_sec < 10)
                curr_sec = "0" + curr_sec;

            var newtimestamp = curr_year + "-" + curr_month + "-" + curr_date + " " + curr_hour + ":" + curr_min + ":" + curr_sec;
            Senconds += 1000;
            $('#curTime').text(newtimestamp);
            if(bChangeDate)
            {
                $( "#datepicker" ).datepicker( "setDate", curr_year + "-" + curr_month + "-" + curr_date );
                $('#combohour').scombobox('val', curr_hour); 
                $('#combomin').scombobox('val', curr_min); 
                $('#combosecond').scombobox('val', curr_sec); 
                TimeModeChangeEnableDisableElement();
            }
        }
        
        function TimeModeChangeEnableDisableElement(){           
            var check_val = $( ".radiotime:checked" ).val();            
            switch(check_val){
                case 'manually':
                    $( "#btnupdate" ).button( "option", "disabled", true );
                    $( "#datepicker" ).datepicker("option", "disabled", false );
                    var disabled = false;
                    $('#combohour').scombobox('disabled', disabled); 
                    $('#combomin').scombobox('disabled', disabled); 
                    $('#combosecond').scombobox('disabled', disabled);                    
                    disabled = true;
                    $('#combontpserver').scombobox('disabled', disabled); 
                    break;
                case 'sync':
                    $( "#btnupdate" ).button( "option", "disabled", false );
                    $( "#datepicker" ).datepicker("option", "disabled", true );                    
                    var disabled = true;
                    $('#combohour').scombobox('disabled', disabled);    
                    $('#combomin').scombobox('disabled', disabled); 
                    $('#combosecond').scombobox('disabled', disabled);                     
                    disabled = false;
                    $('#combontpserver').scombobox('disabled', disabled); 
                    break;
            }
        }
        
        return oUISystemContorl;
    }
};