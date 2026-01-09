    let email=document.getElementById('email');
    let password=document.getElementById('password');
    let submit=document.getElementById('submit');
    let maind=document.getElementById('maind');
    let waredd=document.getElementById('waredd');
    let cud=document.getElementById('cud');
    let user=document.getElementById('user');
    let sidenav=document.getElementById('side-nav');
    let dashboard=document.getElementById('dashboard');
    let dashboardd=document.getElementById('dashboardd');
   function submitt(){
    if(email.value=='0'&&password.value=='0'){
      
           user.style.display = 'none';

    // إظهار الناف
    sidenav.style.display = 'block';

    // إخفاء كل الصفحات
    document.querySelectorAll(".page")
      .forEach(p => p.classList.remove("show"));

    // إظهار الداشبورد فقط
    document.getElementById("dashboard").classList.add("show");
    document.getElementById("dashboardd").classList.add("active");
  
    
      
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
 
       

   
   }

   /* ===== تسجيل الخروج ===== */
function logoutt() {
  email.value = '';
  password.value = '';

  // إظهار صفحة اللوجين
  user.style.display = 'flex';

  // إخفاء الناف
  sidenav.style.display = 'none';

  // إخفاء كل الصفحات
  document.querySelectorAll(".page")
    .forEach(p => p.classList.remove("show"));
     document.querySelectorAll(".nav-item")
    .forEach(p => p.classList.remove("active"));

  // رجوع للداشبورد
  
}

