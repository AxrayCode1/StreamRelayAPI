var ActionStatus = {
    GetRelay: 0,
    CreateRelay: 1,
    DeleteRealy: 2,
    ResumeRelay:3,
    GetIP:24,
    SetIP:25,
    SystemChangePWD:41
};
var ErrorHandle = {
    createNew: function() {                        
        var oError = {};
        oError.CheckAuth = function(InputHttpCode,InputAction) {
            var bAuth = false;
            var sError = '';
            switch(InputHttpCode)
            {
                case 503:
                    alert('Error : DB service is unavaliable.');
                    window.location = '/ui/index.html';
                    break;
                case 401:
                    alert('Error : Authorization Error.');
                    window.location = '/ui/index.html';
                    break;
                case 200:
                    bAuth = true;
                    break;
                case 400:
                    if(InputAction === ActionStatus.SystemChangePWD)
                        alert('Error : Password is modified faliure.');
                    break;
                default:
                    sError = oError.AlertErrorByAction(InputAction);
                    alert(sError);
                    window.location = '/ui/index.html';
            }
            return bAuth;
        };
        oError.AlertErrorByAction = function(InputAction){
            var sError = '';
            switch(InputAction){
                case ActionStatus.GetRelay:
                    sError = "Error : Ajax Get Relay Error";
                    break;
                case ActionStatus.CreateRelay:
                    sError = "Error : Ajax Create Relay Error";
                    break;
                case ActionStatus.DeleteRealy:
                    sError = "Error : Ajax Delete Relay Error";
                    break;
                case ActionStatus.ResumeRelay:
                    sError = "Error : Ajax Resume Relay Error";
                    break;
                case ActionStatus.GetIP:
                    sError = "Error : Ajax Get IP Error";
                    break;
                case ActionStatus.SetIP:
                    sError = "Error : Ajax Set IP Error";
                    break;
            }
            return sError;
        }        
        return oError;
    }
};


