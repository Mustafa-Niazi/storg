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
    let navtoggle=document.getElementById('nav-toggle');
  
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
    document.getElementById("nav-toggle").classList.add("activei");
    document.getElementById("nav-toggle").classList.remove("hidee");
    
    
      
    }
    else{
      if(email.value!=''&&password.value!=''){ if(email.value!='0'){alert('اسم المستخدم غير صحيح')}
      
        else{
            if(password.value=='0'){
       
      }
      else{
         alert('كلمه المرور غير صحيحه')
      }
          
       
      }}
        else
        {alert(' جميع الحقول مطلوبه ')}
     

      
      
       
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
    document.querySelectorAll(".side-nav")
    .forEach(p => p.classList.remove("active"));
       document.getElementById("nav-toggle").classList.add("hidee");


  // رجوع للداشبورد
  
}

