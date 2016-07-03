<?php
require_once('config.php');
mysql_query("START TRANSACTION");
$jsonObj= array(); 
$jsonObj2=array();
$nameArray=array();
$userarray=array();
$orderid=$_POST['order_id'];
$loginid=$_POST['login_id'];
$barcode_value=$_POST['barcode_value'];
if($orderid !=NULL && $loginid !=NULL && $barcode_value !=NULL){
	$result = mysql_query("select * FROM order_master WHERE order_id='$orderid' AND order_active='0'"); 
	if(mysql_num_rows($result)>0){
		$json=explode(",",$loginid);
		foreach($json as $random){	
			$id=trim($random);
			$req = mysql_query("select login_name,profile_picture,order_id FROM login_log,order_master WHERE login_log.login_id = '$id' AND login_log.login_id = '$id' AND order_active = '0'");
			if(mysql_num_rows($req)>0){
				$name=mysql_fetch_assoc($req);
				$loginname=$name['login_name'];
				$loginProfile=$name['profile_picture'];
				$result1 = mysql_query("select * FROM order_detail WHERE order_id='".$name['order_id']."' AND detail_status='1'"); 
				if(mysql_num_rows($result1)>0){
				
					$data= array( 
						'type' => '20',
						'login_name' => $loginname,	
						'profile_picture' => $loginProfile,	
					);
					sendnotification($id,$data);
				
				}
			}
		}
	}	
}

$final_res =json_encode($jsonObj2);
echo $final_res;
mysql_close($dbhandle);
die;
function sendGoogleCloudMessage( $data, $ids, $gKey,$num ){
	// Insert real GCM API key from Google APIs Console
	// https://code.google.com/apis/console/        
	$apiKey = $gKey;

	// Define URL to GCM endpoint
	$url = 'https://gcm-http.googleapis.com/gcm/send';

	// Set GCM post variables (device IDs and push payload)     
	if($num == 0){
		$notifi = array(
			"title" => "Yourder", "body" =>$data['message'],"data" =>$data,"badge" => 3,"type" =>$data['type'], "sound" => "default" ,"icon"=> "@drawable/pin_map"
		);
		$post = array(
			'data' => $data,
			'notification' => $notifi,
			'registration_ids'  => $ids,
			'content_available' => true,
			'priority' => 'high'
		);
	}else{
		$post = array(
			'data' => $data,
			'registration_ids'  => $ids,
			'content_available' => true,
			'priority' => 'high'
		);
	}
	
	
	// Set CURL request headers (authentication and type)    
										   
	$headers = array( 
		'Authorization: key=' . $gKey,
		'Content-Type: application/json'
	);
 
	// Initialize curl handle       
	$ch = curl_init();

	// Set URL to GCM endpoint      
	curl_setopt( $ch, CURLOPT_URL, $url );
 
	// Set request method to POST       
	curl_setopt( $ch, CURLOPT_POST, true );

	// Set our custom headers       
	curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );

	// Get the response back as string instead of printing it       
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );

	// Set JSON post data
	curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $post ) );

	// Actually send the push   
	$result = curl_exec( $ch );
	//echo "CALL";
	// Error handling
	if( curl_errno( $ch ) ){
		//		echo 'GCM error: ' . curl_error( $ch );
	}

	// Close curl handle
	curl_close( $ch );

	// Debug GCM response       
	/*echo $result;*/
}

function sendnotification($loginID,$data){
	$gcmQry= mysql_query("select * FROM user_gcm where login_id='$loginID'");
	$rowsqry=mysql_fetch_assoc($gcmQry);
	$regid=$rowsqry['gcm_registration_id'];
	$type=$rowsqry['type'];
					    
	$ids = array($regid);   
	if($type =='200'){ 
		sendGoogleCloudMessage($data,$ids,"AIzaSyDdT60o_FF_JsxLdVVsT1DuHM4_g6gep_A",0);
	}else{
		sendGoogleCloudMessage($data,$ids,"AIzaSyAaxuuuz2F7vsEENTIggk38dbGDRtJZQL8",1);
	}
}	
?>