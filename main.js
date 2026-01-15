 let datepicker = document.getElementById('datepicker');
let الاسم = document.getElementById('الاسم');
let الكمية = document.getElementById('الكمية');
let الكود = document.getElementById('الكود');
let خارج = document.getElementById('خارج');
let addInn = document.getElementById('addInn');
let addout = document.getElementById('addout');

let dataprob = JSON.parse(localStorage.getItem('product') || '[]');
let tmpp;
let moode = "createin";
let currentIn = 0;
let currentOut = 0;




let codeeData = JSON.parse(localStorage.getItem('codee')) || [];


let codeNameMap = {};
// تحديث كائن codeNameMap
codeNameMap = {};
codeeData.forEach(item => codeNameMap[item.codee] = item.namee);
// تحديث جدول المنتجات فورًا بدون فقدان الصفحة
if ($.fn.DataTable.isDataTable('#myTable')) {
    let currentPage = $('#myTable').DataTable().page(); // حفظ الصفحة الحالية
    $('#myTable').DataTable().clear().destroy();       // تدمير الجدول القديم
    shodata();                                        // إعادة بناء tbody
    updateTable();                                    // إعادة تهيئة DataTable
    $('#myTable').DataTable().page(currentPage).draw(false); // العودة للصفحة الحالية
} else {
    shodata();
    updateTable();
}



if (Array.isArray(codeeData)) {
    codeeData.forEach(item => {
        codeNameMap[item.codee] = item.namee;  
    });
} else {

    codeNameMap = codeeData;
}







// ======== عرض الجدول الأساسي ========
// function shodata() {
//     let tablee = '';
//     let total = 0;
//     let inCount = 0;
//     let outCount = 0;

//     for (let i = 0; i < dataprob.length; i++) {
//         tablee += `
//         <tr>
//             <td>${dataprob[i].datepicker}</td> 
//             <td>${dataprob[i].السعر}</td> 
//             <td>${dataprob[i].الكود}</td>
//             <td>${dataprob[i].المسمي}</td>
//             <td>${dataprob[i].tyep}</td>
//             <td>  <button class="delete-btn" onclick="deleteItem(${i}) "> حذف   <i class="fa-solid fa-trash-can"></i>  </button></td>
//             <td><button class="ubdate-btn" onclick="updateItem(${i})"> تعديل  <i class="fa-regular fa-pen-to-square"></i> </button></td>
//         </tr>`;
//         total += Number(dataprob[i].السعر);
//         if (dataprob[i].tyep === 'داخل') inCount += dataprob[i]. الكمية;
//         else if (dataprob[i].tyep === 'خارج') outCount += dataprob[i].الكمية;
//     }
    

//     document.getElementById('tbody').innerHTML = tablee;
//     document.getElementById('totalQuantity').innerText = dataprob.length;
//     document.getElementById('totalPrice').innerText = total;
//     document.getElementById('typeinfo1').innerText = `داخل: ${inCount}`;
//     document.getElementById('typeinfo2').innerText = `خارج: ${outCount}`;
//     document.getElementById('inn').innerText = ` ${inCount}`;
//     document.getElementById('out').innerText = ` ${outCount}`;
//     document.getElementById('balance').innerText = ` ${inCount-outCount}`;

//     showInTable(); // تحديث جدول الداخل تلقائياً
// }

function checkStock(code, qty) {
    let totalIn = dataprob
        .filter(d => d.الكود === code && d.tyep === 'داخل')
        .reduce((sum, d) => sum + Number(d.الكمية), 0);

    let totalOut = dataprob
        .filter(d => d.الكود === code && d.tyep === 'خارج')
        .reduce((sum, d) => sum + Number(d.الكمية), 0);

    let balance = totalIn - totalOut;

    if (totalIn === 0) {
        alert("هذا الصنف غير موجود في المخزن!");
        return false; // غير متوفر
    }

    if (qty > balance) {
        alert(`الكمية غير كافية! الرصيد الحالي: ${balance}`);
        return false; // الرصيد غير كافي
    }

    return true; // الكمية متاحة
}

// ======== إضافة أو تحديث عنصر ========
 function handleAddOrUpdate(tyep) {
    let qty = Number(الكمية.value) || 1;

    if (!datepicker.value || !الكود.value)
        return alert("اكمل كل البيانات!");

    // التحقق قبل إضافة "خارج"
    if (tyep === 'خارج') {
        let totalIn = dataprob
            .filter(d => d.الكود === الكود.value && d.tyep === 'داخل')
            .reduce((sum, d) => sum + Number(d.الكمية), 0);

        let totalOut = dataprob
            .filter(d => d.الكود === الكود.value && d.tyep === 'خارج')
            .reduce((sum, d) => sum + Number(d.الكمية), 0);

        let balance = totalIn - totalOut;
        if (totalIn === 0) return alert("هذا الصنف غير موجود في المخزن!");
        if (qty > balance) return alert(`الكمية غير كافية! الرصيد الحالي: ${balance}`);
    }

    if (moode === "createin") {
        for (let i = 0; i < qty; i++) {
            dataprob.push({
                datepicker: datepicker.value,
                الاسم: الاسم.value,
                الكود: الكود.value,
                الكمية: 1, // كل صف يمثل وحدة واحدة
                tyep: tyep,
                المسمي: codeNameMap[الكود.value] || "غير معروف",
                  الخارج: document.getElementById('خارج').value || '' ,// تخزين القيمة مباشرة
            });
        }
    } else if (moode === "update") {
        dataprob[tmpp].datepicker = datepicker.value;
        dataprob[tmpp].الاسم = الاسم.value;
        dataprob[tmpp].الكود = الكود.value;
        dataprob[tmpp].الكمية = qty;
        moode = "createin";
        addInn.innerText = "إضافة";
        الكمية.style.display = "inline";
        خارج.style.display = "inline";
        addout.style.display = "inline-block";
    }

    localStorage.setItem('product', JSON.stringify(dataprob));

    // تحديث الجدول دون عمل ريفرش كامل
    let currentPage = 0;
    if ($.fn.DataTable.isDataTable('#myTable')) {
        currentPage = $('#myTable').DataTable().page();
        $('#myTable').DataTable().clear().destroy();
    }

    shodata();       // إعادة عرض الجدول
    updateTable();   // إعادة تهيئة DataTable
cleard();
    $('#myTable').DataTable().page(currentPage).draw(false); // العودة للصفحة الحالية
}
  
function cleard(){
    datepicker.value=''
    الاسم.value=''
    الكمية.value=''
    الكود.value=''
    خارج.value=''
}

 
function deleteItem(index) {
    // عنصر المنتج الحالي
    const item = dataprob[index];

    // احسب الرصيد الحالي قبل الحذف
    let totalIn = dataprob
        .filter(d => d.الكود === item.الكود && d.tyep === 'داخل')
        .reduce((sum, d) => sum + Number(d.الكمية), 0);

    let totalOut = dataprob
        .filter(d => d.الكود === item.الكود && d.tyep === 'خارج')
        .reduce((sum, d) => sum + Number(d.الكمية), 0);

    let balance = totalIn - totalOut;

    // لو العنصر اللي هيتحذف داخل وحيخلي الرصيد سالب
    if (item.tyep === 'داخل' && (balance - item.الكمية) < 0) {
        return alert("    لا يمكن مسح هذا المنتج يجب مسح المنتج الخارج منه اولا   !");
    }

    // رسالة تأكيد قبل الحذف
    let confirmDelete = confirm("هل تريد مسح العنصر؟");
    if (!confirmDelete) return;

    // حذف العنصر
    dataprob.splice(index, 1);
    localStorage.setItem('product', JSON.stringify(dataprob));

    // حفظ الصفحة الحالية
    let currentPage = 0;
    if ($.fn.DataTable.isDataTable('#myTable')) {
        currentPage = $('#myTable').DataTable().page();
        $('#myTable').DataTable().clear().destroy();
    }

    // إعادة عرض الجدول
    shodata();

    // إعادة تهيئة DataTable
    let table = $('#myTable').DataTable({
        paging: true,
        searching: true,
        info: true,
        autoWidth: false
    });

    // العودة للصفحة الصحيحة
    let totalPages = table.page.info().pages;
    if (currentPage >= totalPages) currentPage = totalPages - 1;
    if (currentPage < 0) currentPage = 0;
    table.page(currentPage).draw(false);
}







// ======== تحديث عنصر ========
function updateItem(index) {
  let confirmUpdate = confirm("هل تريد تعديل العنصر؟");
    if (!confirmUpdate) return;
    tmpp = index;
    datepicker.value = dataprob[index].datepicker;
    الاسم.value = dataprob[index].الاسم;
    الكود.value = dataprob[index].الكود;
    الكمية.value = dataprob[index].الكمية;
    moode = "update";
    addInn.innerText = "تحديث";
    addout.style.display = "none";
     الكمية.style.display='none'
     خارج.style.display='none'
    scroll({ top: 0, behavior: "smooth" });
}

// ======== جدول الداخل مع التجميع ========
// function showInTable() {
//     let data = JSON.parse(localStorage.getItem('product') || '[]');
//     let grouped = {};

//     data.forEach(item => {
//         if (!grouped[item.الكود]) {
//             grouped[item.الكود] = {
//                 datepicker: item.datepicker,
//                 السعر: 0,
//                 الكود: item.الكود,
//                 داخل: 0,
//                 خارج: 0,
//                 الكمية: 0
//             };
//         }

//         grouped[item.الكود].الكمية = item.الكمية;

//         if (item.tyep === 'داخل') {
//             grouped[item.الكود].داخل = item.الكمية;
//         } else if (item.tyep === 'خارج') {
//             grouped[item.الكود].خارج = item.الكمية;
//         }

//         grouped[item.الكود].السعر = item.السعر;
//     });

//     let rows = '';
//     for (let code in grouped) {
//         let item = grouped[code];
//         let balance = item.داخل - item.خارج;
 
//         rows += `
//         <tr>
//             <td>${item.datepicker}</td>
//             <td>${item.السعر}</td>
//             <td>${item.الكود}</td>
//             <td>${item.الكمية}</td>
//             <td>داخل: ${item.داخل}, خارج: ${item.خارج}, الرصيد: ${balance}</td>
//             <td>
//                 <button onclick="toggleDetails('${item.الكود}', this)">تفاصيل</button>
//             </td>
//         </tr>`;
//     }

//     document.getElementById('tbodyIn').innerHTML = rows;
// }


// ======== تفاصيل + اخفاء التفاصيل ========
// function toggleDetails(code, btn) {
//     let detailsTable = document.getElementById('detailsTable');
//     if (!detailsTable) {
//         detailsTable = document.createElement('table');
//         detailsTable.id = 'detailsTable';
//         detailsTable.style.width = '100%';
//         detailsTable.style.borderCollapse = 'collapse';
//         detailsTable.innerHTML = `
//             <thead>
//                 <tr>
//                     <th>التاريخ</th>
//                     <th>السعر</th>
//                     <th>الكمية</th>
//                     <th>النوع</th>
//                     <th>اسم الصنف</th>
//                 </tr>
//             </thead>
//             <tbody></tbody>
//             <tfoot></tfoot>
//         `;
//         document.body.appendChild(detailsTable);
//     }

//     if (detailsTable.style.display === 'none' || !detailsTable.style.display) {
//         // عرض التفاصيل
//         let data = JSON.parse(localStorage.getItem('product') || '[]');
//         let details = data.filter(d => d.الكود === code);
//         let rows = details.map(d => `
//             <tr>
//                 <td>${d.datepicker}</td>
//                 <td>${d.السعر}</td>
//                 <td>1</td>
//                 <td>${d.tyep}</td>
//                 <td>${d.الكود}</td>
//             </tr>
//         `).join('');
//         detailsTable.querySelector('tbody').innerHTML = rows;
//         detailsTable.style.display = 'table';
//         btn.innerText = 'إخفاء';
//     } else {
//         // اخفاء التفاصيل
//         detailsTable.style.display = 'none';
//         btn.innerText = 'تفاصيل';
//     }
// }

// ======== تشغيل تلقائي عند تحميل الصفحة ========
document.addEventListener('DOMContentLoaded', function() {
  addInn.addEventListener('click', () => handleAddOrUpdate('داخل'));
    addout.addEventListener('click', () => handleAddOrUpdate('خارج'));
    shodata();
    updateTable();
});


window.addEventListener("storage", function (e) {

  if (e.key === "product") {
    dataprob = JSON.parse(localStorage.getItem("product")) || [];
    shodata();
  }

  if (e.key === "codee") {
    dataproo = JSON.parse(localStorage.getItem("codee")) || [];
    codeeData = dataproo;

    codeNameMap = {};
    codeeData.forEach(item => {
      codeNameMap[item.codee] = item.namee;
    });

    showdataa();
    fillSelect();
  }
});




//============cu==========
 let codee = document.getElementById('codee');
let namee = document.getElementById('namee');
let codeLists = document.getElementById('codeLists');
let save = document.getElementById('save');
 let modee='create';

let tmpt = null;

// تحميل البيانات من localStorage
let dataproo = localStorage.codee
    ? JSON.parse(localStorage.codee)
    : [];

// عرض أولي
showdataa();
fillSelect();


// حفظ
function savea() {
    if (codee.value === '' || namee.value === '') return alert("املأ البيانات");

    // التحقق من الكود إذا موجود مسبقًا عند create
    if (modee === 'create' && codeeData.some(item => item.codee === codee.value)) {
        return alert("هذا الكود موجود بالفعل!");
    }

    let newdataa = { codee: codee.value, namee: namee.value };

    if (modee === 'create') {
        dataproo.push(newdataa);
        codeeData.push(newdataa);
    } else if (modee === 'edit') {
     
        // عند التعديل لا نسمح بتغيير الكود إلى كود موجود مسبقًا
        if (tmpt !== null && codeeData.some((item, idx) => item.codee === codee.value && idx !== tmpt)) {
            return alert("هذا الكود موجود بالفعل!");
        }
        dataproo[tmpt] = newdataa;
        codeeData[tmpt] = newdataa;
        modee = 'create';
        save.innerHTML = 'حفظ';
        tmpt = null;
    }

    // حفظ الكودات في localStorage
    localStorage.setItem('codee', JSON.stringify(codeeData));

    // تحديث كائن codeNameMap
    codeNameMap = {};
    codeeData.forEach(item => codeNameMap[item.codee] = item.namee);

    // تحديث المنتجات فورًا بدون ريفريش
    refreshProductsAfterCodeChange();

    // إعادة عرض جدول الكودات
    showdataa();
    fillSelect();
    clearInputs();
}






// عرض الجدول
function showdataa(){
    let tablee = '';

    for(let i = 0; i < dataproo.length; i++){
        tablee += `
        <tr>
            <td>${dataproo[i].namee}</td>
            <td>${dataproo[i].codee}</td>
            <td><button class="delete-btn" onclick="deleti(${i})"> حذف   <i class="fa-solid fa-trash-can"></i></button></td>
            <td><button class="ubdate-btn"  onclick="edit(${i})">تعديل  <i class="fa-regular fa-pen-to-square"></i></button></td>
        </tr>`;
    }

    document.getElementById('tbodyy').innerHTML = tablee;
}

// تعبئة الـ select من localStorage
function fillSelect(){
    codeLists.innerHTML = '';

    for(let i = 0; i < dataproo.length; i++){
        let option = document.createElement("option");
        option.textContent = dataproo[i].codee;
        codeLists.appendChild(option);
    }
}
function refreshCodeNameMap() {
    codeNameMap = {};
    codeeData.forEach(item => {
        codeNameMap[item.codee] = item.namee;
    });

    // تحديث المسميات في dataprob تلقائياً
    dataprob = dataprob.map(item => {
        return {
            ...item,
            المسمي: codeNameMap[item.الكود] || "غير معروف"
        };
    });

    localStorage.setItem('product', JSON.stringify(dataprob));
}

function refreshCodeNameMapAndProducts() {
    // تحديث الكائن
    codeNameMap = {};
    codeeData.forEach(item => {
        codeNameMap[item.codee] = item.namee;
    });

    // تحديث المنتجات مباشرة
    dataprob = dataprob.map(item => {
        return {
            ...item,
            المسمي: codeNameMap[item.الكود] || "غير معروف"
        };
    });

    // حفظ التغييرات فورًا في localStorage
    localStorage.setItem('product', JSON.stringify(dataprob));
}
function refreshProductsAfterCodeChange() {
    // تحديث المسميات في dataprob حسب الكود
    dataprob = dataprob.map(item => ({
        ...item,
        المسمي: codeNameMap[item.الكود] || "غير معروف"
    }));

    // حفظ التغييرات فورًا
    localStorage.setItem('product', JSON.stringify(dataprob));

    // إعادة عرض جدول المنتجات بدون ريفريش
    if ($.fn.DataTable.isDataTable('#myTable')) {
        let currentPage = $('#myTable').DataTable().page(); // حفظ الصفحة الحالية
        $('#myTable').DataTable().clear().destroy();       // تدمير الجدول القديم
        shodata();                                        // إعادة بناء tbody
        updateTable();                                    // إعادة تهيئة DataTable
        $('#myTable').DataTable().page(currentPage).draw(false); // العودة للصفحة الحالية
    } else {
        shodata();
        updateTable();
    }
}




// حذف
function deleti(i) {
   let confirmDeletei = confirm("هل تريد مسح العنصر؟");
    if (!confirmDeletei) return; // لو ضغط "لا" نوقف التنفيذ


    dataproo.splice(i, 1);
    codeeData.splice(i, 1);
    localStorage.setItem('codee', JSON.stringify(codeeData));

    // إعادة تحديث الكودات والمنتجات فورًا
    codeNameMap = {};
    codeeData.forEach(item => codeNameMap[item.codee] = item.namee);
    refreshProductsAfterCodeChange();
 console.log('done')
    showdataa();
    fillSelect();
}



// تعديل
function edit(i){
  let confirmUpdatei = confirm("هل تريد تعديل العنصر؟");
    if (!confirmUpdatei) return;
    save.innerHTML='edit'
    
    modee='edit'
    tmpt = i;
    codee.value = dataproo[i].codee;
    namee.value = dataproo[i].namee;

}

// تنظيف الانبوتات
function clearInputs(){
    codee.value = '';
    namee.value = '';
}


//============cu==============


function exportData() {
      let confirmexportData = confirm("هل  تصدير البيانات");
    if (!confirmexportData) return;
  const backup = {
    product: JSON.parse(localStorage.getItem("product")) || [],
    codee: JSON.parse(localStorage.getItem("codee")) || []
  };

  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "store-backup.json";
  a.click();
}


function importData() {
  const fileInput = document.getElementById("importFile");
  const file = fileInput.files[0];
  if (!file) return alert("اختار ملف");

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const backup = JSON.parse(e.target.result);

      // التحقق من صحة الملف
      if (
        !backup ||
        !Array.isArray(backup.product) ||
        !Array.isArray(backup.codee)
      ) {
        return alert("ملف غير صالح");
      }

      // حفظ البيانات
      localStorage.setItem("product", JSON.stringify(backup.product));
      localStorage.setItem("codee", JSON.stringify(backup.codee));

      // تحديث المتغيرات
      dataprob = backup.product;
     dataproo = backup.codee;
    codeeData = dataproo;

    showdataa();
    fillSelect();

      // إعادة بناء الخريطة
      codeNameMap = {};
      codeeData.forEach(item => {
        codeNameMap[item.codee] = item.namee;
      });

      // إعادة تهيئة DataTable
      if ($.fn.DataTable && $.fn.DataTable.isDataTable('#myTable')) {
        $('#myTable').DataTable().clear().destroy();
      }

      // عرض البيانات (الاتنين مع بعض)
      shodata();
      showdataa();
      
      // تشغيل DataTable بعد ملء الجدول
      if ($.fn.DataTable) {
          $('#myTable').DataTable();
        }
        
        alert("تم الاستيراد بنجاح");
        fileInput.value = "";
        
    } catch (err) {
        alert("خطأ في قراءة الملف");
        console.error(err);
    }
};

reader.readAsText(file);
 updateTable()
}





function importDataa() {
    let importFile = document.getElementById('importFile');
    importFile.click();
    // console.log('clicked');
    // if (!filetese) {
    //     console.log("عنصر الإدخال غير موجود!");
    //     return; // نوقف التنفيذ لتجنب الخطأ
    // }

    // let file = filetese.files[0]; // أول ملف
    // if (file) {
    //     console.log("اسم الملف:", file.name);
    // } else {
    //     console.log("لم يتم اختيار أي ملف");
    // }
}



    
function updateTable() {
    // أولاً نعرض الجدول العادي
    shodata();

    // لو الجدول DataTable موجود، ندمّره قبل إعادة التهيئة
    if ($.fn.DataTable.isDataTable('#myTable')) {
        $('#myTable').DataTable().destroy();
    }

    // إعادة تهيئة DataTable
    $('#myTable').DataTable({
        paging: true,
        searching: true,
        info: true,
        autoWidth: false
    });
}

window.addEventListener("storage", function (e) {
    if (e.key === "product") {
        dataprob = JSON.parse(localStorage.getItem("product")) || [];
        shodata();
        updateTable();
    }
    if (e.key === "codee") {
        codeeData = JSON.parse(localStorage.getItem("codee")) || [];
        refreshCodeNameMapAndProducts();
        showdataa();
        fillSelect();
        shodata();
        updateTable();
    }
});











const nav = document.querySelector(".side-nav");
const toggle = document.querySelector(".nav-toggle");
const items = document.querySelectorAll(".nav-item");

/* ===== كمبيوتر Hover ===== */
nav.addEventListener("mouseenter", () => {
  if (window.innerWidth > 768) nav.classList.add("active");
});

nav.addEventListener("mouseleave", () => {
  if (window.innerWidth > 768) nav.classList.remove("active");
});

/* ===== موبايل Toggle ===== */
toggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

/* ===== Magnetic Effect ===== */
items.forEach(item => {
  item.addEventListener("mousemove", e => {
    if (window.innerWidth < 769) return;

    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    item.style.transform =
      `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.12)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "translate(0,0) scale(1)";
  });
});

/* ===== التنقل ===== */
document.querySelectorAll("[data-page]").forEach(btn => {
  btn.addEventListener("click", () => {
    const page = btn.dataset.page;

    document.querySelectorAll(".page")
      .forEach(p => p.classList.remove("show"));

    document.getElementById(page).classList.add("show");

    document.querySelectorAll(".nav-item")
      .forEach(n => n.classList.remove("active"));

    btn.classList.add("active");

    nav.classList.remove("active");
    
  });
});







