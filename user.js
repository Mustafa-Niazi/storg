    let email=document.getElementById('email');
    let password=document.getElementById('password');
    let submit=document.getElementById('submit');
    let main=document.getElementById('main');
    let user=document.getElementById('user');

   function submitt(){
    if(email.value=='0'&&password.value=='0'){

       
      
             user.style.display='none'
          main.style.display='block'
            
    }
    else{
      if(email.value=='0'){
        if(password.value=='0'){
       
      }
      else{
         alert('كلمه المرور غير صحيحه')
      }
      }
      else{

          alert('اسم المستخدم غير صحيح')
       
      }
        
         
       
    }
    
    
    
   }

   function logoutt(){
    
      user.style.display='flex'
          main.style.display='none'
           email.value=''
          password.value=''
          console.log(  main.value, user.value)

   }