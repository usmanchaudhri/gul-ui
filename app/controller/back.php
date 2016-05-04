<?php 
	
	
	else{
			
		//$order_id=$_POST['order_id'];
		$rest_id=$_POST['rest_id'];
		$order_userid=$_POST['login_id'];
		$order_status =$_POST['order_status'];
		$today = date("M-d-Y");
		$barcode_value=$_POST['barcode_value'];
		$cat_id=$_POST['cat_id'];
		$dish_id=$_POST['dish_id'];
		$detail_quantity = $_POST['detail_quantity'];
		$detail_status = $_POST['detail_status'];
		$comment=$_POST['comments'];
		$splitwith=$_POST['splitwith']; 
		//echo 
		$result =mysql_query("INSERT INTO order_master(rest_id,login_id,barcode_value,order_status) VALUES ('$rest_id','$order_userid','$barcode_value','$order_status')") or die(mysql_error());
		if($result==TRUE){
			$res = mysql_query("select * FROM order_master WHERE login_id='$order_userid' AND order_active = 0");
			$row=mysql_fetch_assoc($res);
			$id=$row['order_id'];
			$sender_id=$row['login_id'];
			//echo "Sender ID: ".$sender_id;
		
			$random=mysql_query("INSERT INTO order_detail(order_id,cat_id,item_id,detail_quantity,detail_status,comments,splitwith) VALUES ('$id','$cat_id','$dish_id','$detail_quantity','$detail_status','$comment','$splitwith')");
			if($random==TRUE){
				if($splitwith != ''){
					$rows = mysql_query("select * FROM order_detail WHERE order_id='$id' ORDER BY detail_id DESC") or die (mysql_error());
					$get=mysql_fetch_assoc($rows);
					$item_id=$get['item_id'];
					$detail_id=$get['detail_id'];
					$json = explode(",",$get['splitwith']);
					$jsonObj5 = array();
					$jsonObj5 = "";
				
				
					$req = mysql_query("select login_name FROM login_log WHERE login_id = '$order_userid'");
					$name=mysql_fetch_assoc($req);
					$loginname=$name['login_name'];
					$reqitem = mysql_query("select item_name FROM rest_items WHERE items_id ='$dish_id'");
					$name=mysql_fetch_assoc($reqitem);
					$itemsname=$name['item_name'];		
					$message=$loginname."wants to split ".$itemsname."with you";
				
				
					foreach($json as $notiData){
				
						$notification=mysql_query("INSERT INTO notifications(items_id,sender_id,reciver_id,message,notification_date,detail_id) VALUES ('$item_id','$sender_id','$notiData','$message','$today','$detail_id')") or die (mysql_error());
						if($notification==TRUE){
							$resqry= mysql_query("select * FROM login_log where login_id='$sender_id'");
							if(mysql_num_rows($resqry)>0){
						
								$row=mysql_fetch_assoc($resqry);
								$login_name=$row['login_name'];
								$profile=$row['profile_picture'];
								$resorder=mysql_query("select * FROM rest_items where items_id='$items_id'");
								$roworder=mysql_fetch_assoc($resorder);
								$item_name=$roworder['item_name'];
								$message=$login_name." wants to split ".$item_name." with you";
					 
								$resQry= mysql_query("select * FROM user_gcm where login_id='".$id."'");
								if(mysql_num_rows($resQry)>0){
						
									$rowsqry=mysql_fetch_assoc($resQry);
									$regid=$rowsqry['gcm_registration_id'];
									$type=$rowsqry['type'];
						
									$resnoti= mysql_query("select notification_id FROM notifications ORDER BY notification_id DESC LIMIT 1 ");
									if(mysql_num_rows($resnoti)>0){
					
										$rowsnoti=mysql_fetch_assoc($resnoti);
								
										$data = array( 
											'notification_id'=>$rowsnoti['notification_id'],
											'profile_picture'=>$profile,
											'message' =>$message,
											'login_name'=>$login_name);
				
										/**
										* 
										* IOS SERVER API KEY
										* AIzaSyDdT60o_FF_JsxLdVVsT1DuHM4_g6gep_A
										* 
										* Android SERVER API KEY
										* AIzaSyAaxuuuz2F7vsEENTIggk38dbGDRtJZQL8
										* 
										*/					
								
										$ids = array($regid);   
										if($type =='200'){
											sendGoogleCloudMessage($data,$ids,"AIzaSyDdT60o_FF_JsxLdVVsT1DuHM4_g6gep_A");
										}else{
											sendGoogleCloudMessage($data,$ids,"AIzaSyAaxuuuz2F7vsEENTIggk38dbGDRtJZQL8");
										}

	
										//echo $email;
										$jsonArr[]=array(
											'receiver_id' => $recID,
											'receiver_email'=>$email,
											'notification_id'=>$rowsnoti['notification_id']
										);
									}
								}
							}
					
				
						}else{
							$jsonObj = array(
								'status' => '0',
								'message' => 'Dish Added To Cart'
							);
						}
					}
		
					$jsonObj = array(
						'status' => '0',
						'order_id' =>$id,
						'data'=>$jsonObj5,
						'message'=>'Dish Added To Cart'
					);	
		
				}else{
					$jsonObj = array(
						'status' => '0',
						'order_id' =>$id,
						'data'=>[],
						'message' =>"Dish Added To Cart"
					);
				}
			}
		}
		else{
			$jsonObj = array(
				'status' => '1',
				'message' => 'Record Not Added'
			);
		}	
	}

?>