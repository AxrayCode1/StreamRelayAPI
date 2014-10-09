<?php
include_once '/var/www/html/include/Config.php';
$oLogin = new Login();
var_dump($oLogin->DB_Connection());
class Login{
    public $PDODB;
    public function DB_Connection()
    {
        // if connection already exists
        if ($this->PDODB != null) {
            return true;
        } else {
            try {
                // Generate a database connection, using the PDO connector
                // @see http://net.tutsplus.com/tutorials/php/why-you-should-be-using-phps-pdo-for-database-access/
                // Also important: We include the charset, as leaving it out seems to be a security issue:
                // @see http://wiki.hashphp.org/PDO_Tutorial_for_MySQL_Developers#Connecting_to_MySQL says:
                // "Adding the charset to the DSN is very important for security reasons,
                // most examples you'll see around leave it out. MAKE SURE TO INCLUDE THE CHARSET!"
                $this->PDODB = new PDO('mysql:host='. DB_HOST .';dbname='. DB_NAME . ';charset=utf8', DB_USER, DB_PASS);
                return true;
            } catch (PDOException $e) {
                $this->errors[] = MESSAGE_DATABASE_ERROR . $e->getMessage();
            }
        }
        // default return
        return false;
    }
    
    public function Sec_Session_Start() {
        $session_name = 'sec_session_acrored';   // Set a custom session name 
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
    
    function Login($sInputUserName, $sInputPassword, $mysqli) {
        // Using prepared statements means that SQL injection is not possible. 
        if ($stmt = $mysqli->prepare("SELECT id, username, password, salt 
				  FROM members 
                                  WHERE email = ? LIMIT 1")) {
            $stmt->bind_param('s', $email);  // Bind "$email" to parameter.
            $stmt->execute();    // Execute the prepared query.
            $stmt->store_result();

            // get variables from result.
            $stmt->bind_result($user_id, $username, $db_password, $salt);
            $stmt->fetch();

            // hash the password with the unique salt.
            $password = hash('sha512', $password . $salt);
            if ($stmt->num_rows == 1) {
            // If the user exists we check if the account is locked
            // from too many login attempts 
//            if (checkbrute($user_id, $mysqli) == true) {
//                // Account is locked 
//                // Send an email to user saying their account is locked 
//                return false;
//            } else {
                // Check if the password in the database matches 
                // the password the user submitted.
                if ($db_password == $password) {
                    // Password is correct!
                    // Get the user-agent string of the user.
                    $user_browser = $_SERVER['HTTP_USER_AGENT'];

                    // XSS protection as we might print this value
                    $user_id = preg_replace("/[^0-9]+/", "", $user_id);
                    $_SESSION['user_id'] = $user_id;

                    // XSS protection as we might print this value
                    $username = preg_replace("/[^a-zA-Z0-9_\-]+/", "", $username);

                    $_SESSION['username'] = $username;
                    $_SESSION['login_string'] = hash('sha512', $password . $user_browser);

                    // Login successful. 
                    return true;
                } else {
                    // Password is not correct 
                    // We record this attempt in the database 
                    $now = time();
                    if (!$mysqli->query("INSERT INTO login_attempts(user_id, time) 
                                    VALUES ('$user_id', '$now')")) {
                        header("Location: ../error.php?err=Database error: login_attempts");
                        exit();
                    }

                    return false;
                }
//            }
        } 
        else {
            // No user exists. 
            return false;
        }
    } 
    else {
        // Could not create a prepared statement
        header("Location: ../error.php?err=Database error: cannot prepare statement");
        exit();
    }
}
    
    public function Login_Check($PDO) {    
        if (isset($_SESSION['UserID'], $_SESSION['UserName'], $_SESSION['LoginString'])) {
            $iUserID = $_SESSION['UserID'];
            $sLoginString = $_SESSION['LoginString'];            

            // Get the user-agent string of the user.
            $UserBrowser = $_SERVER['HTTP_USER_AGENT'];

            if ($stmt = $mysqli->prepare("SELECT password 
                                          FROM members 
                                          WHERE id = ? LIMIT 1")) {
                // Bind "$user_id" to parameter. 
                $stmt->bind_param('i', $user_id);
                $stmt->execute();   // Execute the prepared query.
                $stmt->store_result();

                if ($stmt->num_rows == 1) {
                    // If the user exists get variables from result.
                    $stmt->bind_result($password);
                    $stmt->fetch();
                    $login_check = hash('sha512', $password . $user_browser);

                    if ($login_check == $login_string) {
                        // Logged In!!!! 
                        return true;
                    } else {
                        // Not logged in 
                        return false;
                    }
                } else {
                    // Not logged in 
                    return false;
                }
            } else {
                // Could not prepare statement
                header("Location: ../error.php?err=Database error: cannot prepare statement");
                exit();
            }
        } else {
            // Not logged in 
            return false;
        }
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
        $this->DeleteRememberMeCookie();

        $_SESSION = array();
        session_destroy();
    }

}
?>

