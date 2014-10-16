<?php
include_once '/var/www/html/include/Config.php';
include_once '/var/www/html/include/Enum.php';
//salt : a7589e77a8a2a21c37b168e6d7ff817b93f2d19a5154f3ac1df51b9efbca535bb1858a75aaaca5ee255408bc1f785619799f2c8b7c5ca32202b68deee71c46d9
//password : 708a0d020a9962ebd63d6667f5eb4f3c8d315ad473748f0774c01114ee6bf5357afc72e5eef1bda7945b6357c447a94e0c843020b3462235cd956b1f0c923639
//$oLogin = new Login();
//$oLogin->Sec_Session_Start();
//$oLogin->DB_Connection();
////var_dump($oLogin->Login_Check());
//$oLogin->Login_By_Data('admin', hash('sha512', '000000'));
//var_dump($_SESSION);
class Login{
    
    public $PDODB;
    public function DB_Connection()
    {
        // if connection already exists
        if ($this->PDODB != null) {
            return LoginStatus::DBConnectSuccess;
        } else {
            try {
                // Generate a database connection, using the PDO connector
                // @see http://net.tutsplus.com/tutorials/php/why-you-should-be-using-phps-pdo-for-database-access/
                // Also important: We include the charset, as leaving it out seems to be a security issue:
                // @see http://wiki.hashphp.org/PDO_Tutorial_for_MySQL_Developers#Connecting_to_MySQL says:
                // "Adding the charset to the DSN is very important for security reasons,
                // most examples you'll see around leave it out. MAKE SURE TO INCLUDE THE CHARSET!"
                $this->PDODB = new PDO('mysql:host='. DB_HOST .';dbname='. DB_NAME . ';charset=utf8', DB_USER, DB_PASS);
                return LoginStatus::DBConnectSuccess;
            } catch (PDOException $e) {
                return LoginStatus::DBConnectFail;
            }
        }
        // default return
        return LoginStatus::DBConnectFail;
    }
    
    public function Sec_Session_Start() {
        $session_name = 'SessionAcrored';   // Set a custom session name 
        $secure = SECURE;

        // This stops JavaScript being able to access the session id.
        $httponly = true;

        // Forces sessions to only use cookies.
        if (ini_set('session.use_only_cookies', 1) === FALSE) {
            echo "Not Support Only Cookies";
            exit();
        }

        // Gets current cookies params.
        $cookieParams = session_get_cookie_params();
        session_set_cookie_params($cookieParams["lifetime"], $cookieParams["path"], $cookieParams["domain"], $secure, $httponly);

        // Sets the session name to the one set above.
        session_name($session_name);

        session_start();            // Start the PHP session 
        session_regenerate_id();    // regenerated the session, delete the old one. 
    }
    
    function Login_By_Data($sInputUserName, $sInputPassword) {        
        $sqlSELECTUser = <<<SQL
                SELECT idUser,password,salt From tbUser
                WHERE nameUser = :nameUser LIMIT 1;
SQL;
        $Stmt = $this->PDODB->prepare($sqlSELECTUser);
        // Using prepared statements means that SQL injection is not possible. 
        if ($Stmt) {
            $Stmt->bindValue(':nameUser', $sInputUserName, PDO::PARAM_STR);
            $Stmt->execute();    // Execute the prepared query.               
            if ($Stmt->rowCount() == 1) {
                while ($row = $Stmt->fetch()) {
                    $DBUserID = (int)$row['idUser'];                    
                    $DBUserPassword = $row['password'];
                    $DBUserSalt = $row['salt'];
                }              
                // hash the password with the unique salt.
                $sPassword = hash('sha512', $sInputPassword . $DBUserSalt);
                if ($DBUserPassword === $sPassword) {
                    // Password is correct!
                    // Get the user-agent string of the user.
                    $sUserBrowser = $_SERVER['HTTP_USER_AGENT'];

                    // XSS protection as we might print this value
                    $UserID = preg_replace("/[^0-9]+/", "", $DBUserID);
                    $_SESSION['UserID'] = $UserID;

                    // XSS protection as we might print this value
                    $sUsername = preg_replace("/[^a-zA-Z0-9_\-]+/", "", $sInputUserName);

                    $_SESSION['Username'] = $sUsername;
                    $_SESSION['LoginString'] = hash('sha512', $sPassword . $sUserBrowser);                    
                    // Login successful. 
                    setcookie("CheckKey", $sInputPassword);
                    return LoginStatus::LoginSuccess;
                } else {
                    // Password is not correct 
                    // We record this attempt in the database 
//                    $now = time();
//                    if (!$mysqli->query("INSERT INTO login_attempts(user_id, time) 
//                                    VALUES ('$user_id', '$now')")) {
//                        header("Location: ../error.php?err=Database error: login_attempts");
//                        exit();
//                    }

                    return LoginStatus::LoginFail;
                }
//            }
            } 
            else {
                // No user exists. 
                return LoginStatus::LoginFail;
            }
        } 
        else {
            // Could not create a prepared statement
            return LoginStatus::DBPrepareFail;
        }
    }
    
    public function Change_Password($sNewPWD){
        $sqlSELECTUserSalt = <<<SQL
                SELECT salt From tbUser
                WHERE idUser = :idUser LIMIT 1;
SQL;
        $sqlUpdatePassword = <<<SQL
                Update tbUser set tbUser.password=:NewPWD WHERE idUser = :idUser;
SQL;
        if (isset($_SESSION['UserID'])) {
            $iUserID = $_SESSION['UserID'];   
            $Stmt = $this->PDODB->prepare($sqlSELECTUserSalt);                      
            if($Stmt)
            {                
                $Stmt->bindValue(':idUser', $iUserID,  PDO::PARAM_INT);   
                $Stmt->execute();                
                if($Stmt->rowCount() == 1)
                {                                
                    while ($row = $Stmt->fetch()) {                        
                        $DBUserSalt = $row['salt'];
                    }                          
                    $sNewPWD = hash('sha512', $sNewPWD . $DBUserSalt);
                    $Stmt = $this->PDODB->prepare($sqlUpdatePassword);
                    if ($Stmt) {
                        // Bind "$user_id" to parameter. 
                        $Stmt->bindValue(':NewPWD', $sNewPWD,  PDO::PARAM_STR);
                        $Stmt->bindValue(':idUser', $iUserID,  PDO::PARAM_INT);
                        $Stmt->execute();   // Execute the prepared query.

                        if ($Stmt->rowCount() == 1 || $Stmt->rowCount() == 0) {     
                            $this->SessionDestroy();
                            return LoginStatus::ChangePWDSuccess;                    
                        } else {                    
                            return LoginStatus::ChangePWDFail;
                        }
                    } else {
                        // Could not prepare statement                        
                        return LoginStatus::DBPrepareFail;
                    }
                }
                else {                    
                    return LoginStatus::ChangePWDFail;
                }
            } else {
                // Could not prepare statement
                return LoginStatus::DBPrepareFail;
            }
        } else {            
            return LoginStatus::ChangePWDFail;
        }
    }
    
    public function Login_Check() {    
        $sqlSELECTPassword = <<<SQL
                SELECT password FROM tbUser WHERE idUser = :idUser LIMIT 1
SQL;
        if (isset($_SESSION['UserID'], $_SESSION['Username'], $_SESSION['LoginString'])) {
            $iUserID = $_SESSION['UserID'];
            $sLoginString = $_SESSION['LoginString'];            

            // Get the user-agent string of the user.
            $sUserBrowser = $_SERVER['HTTP_USER_AGENT'];
            $Stmt = $this->PDODB->prepare($sqlSELECTPassword);
            if ($Stmt) {
                // Bind "$user_id" to parameter. 
                $Stmt->bindValue(':idUser', $iUserID,PDO::PARAM_INT);
                $Stmt->execute();   // Execute the prepared query.

                if ($Stmt->rowCount() == 1) {
                    // If the user exists get variables from result.
                    while ($row = $Stmt->fetch()) {                                            
                        $DBUserPassword = $row['password'];                        
                    }
                    $sLoginCheck = hash('sha512', $DBUserPassword . $sUserBrowser);

                    if ($sLoginCheck == $sLoginString) {
                        // Logged In!!!! 
                        return LoginStatus::LoginSuccess;
                    } else {
                        // Not logged in 
                        return LoginStatus::LoginFail;
                    }
                } else {
                    // Not logged in 
                    return LoginStatus::LoginFail;
                }
            } else {
                // Could not prepare statement
                return LoginStatus::DBPrepareFail;
            }
        } else {
            // Not logged in 
            return LoginStatus::LoginFail;
        }
    }        

    /**
     * Logs in via the Cookie
     * @return bool success state of cookie login
     */
    private function Login_With_Cookie_Data()
    {
        if (isset($_COOKIE['rememberme'])) {
            // extract data from the cookie
            list ($user_id, $token, $hash) = explode(':', $_COOKIE['rememberme']);
            // check cookie hash validity
            if ($hash == hash('sha512', $user_id . ':' . $token . COOKIE_SECRET_KEY) && !empty($token)) {
                // cookie looks good, try to select corresponding user
                if ($this->databaseConnection()) {
                    // get real token from database (and all other data)
                    $sth = $this->db_connection->prepare("SELECT user_id, user_name, user_email FROM users WHERE user_id = :user_id
                                                      AND user_rememberme_token = :user_rememberme_token AND user_rememberme_token IS NOT NULL");
                    $sth->bindValue(':user_id', $user_id, PDO::PARAM_INT);
                    $sth->bindValue(':user_rememberme_token', $token, PDO::PARAM_STR);
                    $sth->execute();
                    // get result row (as an object)
                    $result_row = $sth->fetchObject();

                    if (isset($result_row->user_id)) {
                        // write user data into PHP SESSION [a file on your server]
                        $_SESSION['UserID'] = $result_row->user_id;
                        $_SESSION['UserName'] = $result_row->user_name;                        
                        $_SESSION['UserLoggedIn'] = 1;

                        // declare user id, set the login status to true
                        $this->user_id = $result_row->user_id;
                        $this->user_name = $result_row->user_name;
                        $this->user_email = $result_row->user_email;
                        $this->user_is_logged_in = true;

                        // Cookie token usable only once
                        $this->NewRememberMeCookie();
                        return true;
                    }
                }
            }
            // A cookie has been used but is not valid... we delete it
            $this->deleteRememberMeCookie();
            $this->errors[] = MESSAGE_COOKIE_INVALID;
        }
        return false;
    }
    
    /**
     * Create all data needed for remember me cookie connection on client and server side
     */
    private function NewRememberMeCookie()
    {
        // if database connection opened
        if ($this->DB_Connection()) {
            // generate 64 char random string and store it in current user data
            $random_token_string = hash('sha512', mt_rand());
            $sth = $this->db_connection->prepare("UPDATE users SET user_rememberme_token = :user_rememberme_token WHERE user_id = :user_id");
            $sth->execute(array(':user_rememberme_token' => $random_token_string, ':user_id' => $_SESSION['user_id']));

            // generate cookie string that consists of userid, randomstring and combined hash of both
            $cookie_string_first_part = $_SESSION['user_id'] . ':' . $random_token_string;
            $cookie_string_hash = hash('sha512', $cookie_string_first_part . COOKIE_SECRET_KEY);
            $cookie_string = $cookie_string_first_part . ':' . $cookie_string_hash;

            // set cookie
            setcookie('rememberme', $cookie_string, time() + COOKIE_RUNTIME, "/", COOKIE_DOMAIN);
        }
    }
    
    /**
     * Delete all data needed for remember me cookie connection on client and server side
     */
    private function DeleteRememberMeCookie()
    {
        // if database connection opened
        if ($this->databaseConnection()) {
            // Reset rememberme token
            $sth = $this->db_connection->prepare("UPDATE users SET user_rememberme_token = NULL WHERE user_id = :user_id");
            $sth->execute(array(':user_id' => $_SESSION['UserID']));
        }

        // set the rememberme-cookie to ten years ago (3600sec * 365 days * 10).
        // that's obivously the best practice to kill a cookie via php
        // @see http://stackoverflow.com/a/686166/1114320
        setcookie('rememberme', false, time() - (3600 * 3650), '/', COOKIE_DOMAIN);
    }

    /**
     * Perform the logout, resetting the session
     */
    public function DoLogout()
    {
//        $this->DeleteRememberMeCookie();
        $this->sec_session_start();
        $this->SessionDestroy();
    }

    public function SessionDestroy()
    {
         // Unset all session values 
        $_SESSION = array();

        // get session parameters 
        $params = session_get_cookie_params();

        // Delete the actual cookie. 
        setcookie(session_name(),'', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);

        // Destroy session 
        session_destroy();      
    }
    
}
?>