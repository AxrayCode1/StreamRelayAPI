var UISystemControl = {
    createNew:function(oInputHtml,oInputRelayAjax){
        var oHtml = oInputHtml;
        var oRelayAjax = oInputRelayAjax;                        
        var oUISystemContorl={};
        var oError = {};
        oUISystemContorl.Init = function(){   
            oError = ErrorHandle.createNew();
            $('#combotimezone').scombobox({
                wrap:false
            });
            $(".scombobox-display").prop('disabled', true);
            $('#ss').click(function() {
                ClearPassword();
                oHtml.HideAllOption();
                oHtml.ShowOption(DivSystem);                
            });            
            $('#btn_clear_pwd').click(function(){
                ClearPassword();
            });
            $('#btn_chg_pwd').click(function() {
                oUISystemContorl.ChangePasswordAction();
            });
        };                
        
        function ClearPassword(){
            $('#CurPWD').val('');        
            $('#NewPWD').val('');
            $('#ConfNewPWD').val('');
        }
        
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
        return oUISystemContorl;
    }
};