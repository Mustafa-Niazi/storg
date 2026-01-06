 let datepicker = document.getElementById('datepicker');
let السعر = document.getElementById('السعر');
let الكمية = document.getElementById('الكمية');
let الكود = document.getElementById('الكود');
let addInn = document.getElementById('addInn');
let addout = document.getElementById('addout');

let dataprob = JSON.parse(localStorage.getItem('product') || '[]');
let tmpp;
let moode = "createin";



let codeeData = JSON.parse(localStorage.getItem('codee')) || [];


let codeNameMap = {};


if (Array.isArray(codeeData)) {
    codeeData.forEach(item => {
        codeNameMap[item.codee] = item.namee;  
    });
} else {

    codeNameMap = codeeData;
}







// ======== عرض الجدول الأساسي ========
function shodata() {
    let tablee = '';
    let total = 0;
    let inCount = 0;
    let outCount = 0;

    for (let i = 0; i < dataprob.length; i++) {
        tablee += `
        <tr>
            <td>${dataprob[i].datepicker}</td> 
            <td>${dataprob[i].السعر}</td> 
            <td>${dataprob[i].الكود}</td>
            <td>${dataprob[i].المسمي}</td>
            <td>${dataprob[i].tyep}</td>
            <td>  <button class="delete-btn" onclick="deleteItem(${i}) "> حذف   <i class="fa-solid fa-trash-can"></i>  </button></td>
            <td><button class="ubdate-btn" onclick="updateItem(${i})"> تعديل  <i class="fa-regular fa-pen-to-square"></i> </button></td>
        </tr>`;
        total += Number(dataprob[i].السعر);
        if (dataprob[i].tyep === 'داخل') inCount = dataprob[i].الكمية;
        else if (dataprob[i].tyep === 'خارج') outCount = dataprob[i].الكمية;
    }

    document.getElementById('tbody').innerHTML = tablee;
    document.getElementById('totalQuantity').innerText = dataprob.length;
    document.getElementById('totalPrice').innerText = total;
    document.getElementById('typeinfo1').innerText = `داخل: ${inCount}`;
    document.getElementById('typeinfo2').innerText = `خارج: ${outCount}`;
    document.getElementById('inn').innerText = ` ${inCount}`;
    document.getElementById('out').innerText = ` ${outCount}`;
    document.getElementById('balance').innerText = ` ${inCount-outCount}`;

    showInTable(); // تحديث جدول الداخل تلقائياً
}

// ======== إضافة أو تحديث عنصر ========
function handleAddOrUpdate(tyep) {
    let qty = Number(الكمية.value) || 1;
    if (!datepicker.value || !السعر.value || !الكود.value) return alert("اكمل كل البيانات!");

    // التحقق قبل إضافة "خارج"
    if (tyep === 'خارج') {
        let totalIn = dataprob.filter(d => d.الكود === الكود.value && d.tyep === 'داخل').reduce((sum, d) => sum + d.الكمية, 0);
        let totalOut = dataprob.filter(d => d.الكود === الكود.value && d.tyep === 'خارج').reduce((sum, d) => sum + d.الكمية, 0);
        let balance = totalIn - totalOut;
        if (!totalIn) return alert("هذا الصنف غير موجود في المخزن!");
        if (qty > balance) return alert(`الكمية غير كافية! الرصيد الحالي: ${balance}`);
    }

    if (moode === "createin") {
        for (let i = 0; i < qty; i++) {
            dataprob.push({
    datepicker: datepicker.value,
    السعر: Number(السعر.value),
    الكود: الكود.value,
    الكمية: الكمية.value,
    tyep: tyep,
    المسمي: codeNameMap[الكود.value] || "غير معروف"
});

        }
    } else if (moode === "update") {
        dataprob[tmpp].datepicker = datepicker.value;
        dataprob[tmpp].السعر = Number(السعر.value);
        dataprob[tmpp].الكود = الكود.value;
        dataprob[tmpp].الكمية = qty;

        moode = "createin";
        addInn.innerText = "إضافة";
        الكمية.style.display = "inline";
        addout.style.display = "inline-block";
    }

    localStorage.setItem('product', JSON.stringify(dataprob));
    shodata();
}

// ======== حذف عنصر ========
function deleteItem(index) {
    dataprob.splice(index, 1);
    localStorage.setItem('product', JSON.stringify(dataprob));
    shodata();
    
}

// ======== تحديث عنصر ========
function updateItem(index) {
    tmpp = index;
    datepicker.value = dataprob[index].datepicker;
    السعر.value = dataprob[index].السعر;
    الكود.value = dataprob[index].الكود;
    الكمية.value = dataprob[index].الكمية;
    moode = "update";
    addInn.innerText = "تحديث";
    addout.style.display = "none";
    scroll({ top: 0, behavior: "smooth" });
}

// ======== جدول الداخل مع التجميع ========
function showInTable() {
    let data = JSON.parse(localStorage.getItem('product') || '[]');
    let grouped = {};

    data.forEach(item => {
        if (!grouped[item.الكود]) {
            grouped[item.الكود] = {
                datepicker: item.datepicker,
                السعر: 0,
                الكود: item.الكود,
                داخل: 0,
                خارج: 0,
                الكمية: 0
            };
        }

        grouped[item.الكود].الكمية = item.الكمية;

        if (item.tyep === 'داخل') {
            grouped[item.الكود].داخل = item.الكمية;
        } else if (item.tyep === 'خارج') {
            grouped[item.الكود].خارج = item.الكمية;
        }

        grouped[item.الكود].السعر = item.السعر;
    });

    let rows = '';
    for (let code in grouped) {
        let item = grouped[code];
        let balance = item.داخل - item.خارج;
 
        rows += `
        <tr>
            <td>${item.datepicker}</td>
            <td>${item.السعر}</td>
            <td>${item.الكود}</td>
            <td>${item.الكمية}</td>
            <td>داخل: ${item.داخل}, خارج: ${item.خارج}, الرصيد: ${balance}</td>
            <td>
                <button onclick="toggleDetails('${item.الكود}', this)">تفاصيل</button>
            </td>
        </tr>`;
    }

    document.getElementById('tbodyIn').innerHTML = rows;
}


// ======== تفاصيل + اخفاء التفاصيل ========
function toggleDetails(code, btn) {
    let detailsTable = document.getElementById('detailsTable');
    if (!detailsTable) {
        detailsTable = document.createElement('table');
        detailsTable.id = 'detailsTable';
        detailsTable.style.width = '100%';
        detailsTable.style.borderCollapse = 'collapse';
        detailsTable.innerHTML = `
            <thead>
                <tr>
                    <th>التاريخ</th>
                    <th>السعر</th>
                    <th>الكمية</th>
                    <th>النوع</th>
                    <th>اسم الصنف</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        document.body.appendChild(detailsTable);
    }

    if (detailsTable.style.display === 'none' || !detailsTable.style.display) {
        // عرض التفاصيل
        let data = JSON.parse(localStorage.getItem('product') || '[]');
        let details = data.filter(d => d.الكود === code);
        let rows = details.map(d => `
            <tr>
                <td>${d.datepicker}</td>
                <td>${d.السعر}</td>
                <td>1</td>
                <td>${d.tyep}</td>
                <td>${d.الكود}</td>
            </tr>
        `).join('');
        detailsTable.querySelector('tbody').innerHTML = rows;
        detailsTable.style.display = 'table';
        btn.innerText = 'إخفاء';
    } else {
        // اخفاء التفاصيل
        detailsTable.style.display = 'none';
        btn.innerText = 'تفاصيل';
    }
}

// ======== تشغيل تلقائي عند تحميل الصفحة ========
document.addEventListener('DOMContentLoaded', function() {
    addInn.addEventListener('click', () => handleAddOrUpdate('داخل'));
    addout.addEventListener('click', () => handleAddOrUpdate('خارج'));
    shodata();
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
    // تحميل البيانات الحالية من localStorage
    codeeData = JSON.parse(localStorage.getItem('codee')) || [];
    if (codee.value === '' || namee.value === '') {
        alert("املأ البيانات");
        return;
    }

    let newdataa = {
        codee: codee.value,
        namee: namee.value,
    };

    // إضافة أو تعديل البيانات في الكائن dataproo
    if (modee === 'create') {
        // إضافة بيانات جديدة
        dataproo.push(newdataa);
        codeeData.push(newdataa); // تحديث codeeData أيضا
    } else {
        // تعديل بيانات موجودة
        dataproo[tmpt] = newdataa;
        codeeData[tmpt] = newdataa; // تحديث codeeData أيضا
        modee = 'create';
        save.innerHTML = 'حفظ';
    }

    // حفظ البيانات في localStorage
    localStorage.setItem('product', JSON.stringify(dataproo));  // حفظ بيانات المنتجات
    localStorage.setItem('codee', JSON.stringify(codeeData));   // حفظ بيانات الكودات

    // تحديث كائن codeNameMap
    codeNameMap = {};
    codeeData.forEach(item => {
        codeNameMap[item.codee] = item.namee;  // تحديث codeNameMap بالكود والاسم
    });

    // تحديث العرض بعد الحفظ
    clearInputs();
    showdataa();
    fillSelect();
    console.log(codeNameMap);  // لمراجعة البيانات المحدثة
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

// حذف
function deleti(i){
    dataproo.splice(i, 1);
    localStorage.codee = JSON.stringify(dataproo,codeNameMap);


    console.log(i)
    clearInputs();
   
  showdataa();
    fillSelect();
}

// تعديل
function edit(i){
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
}
    
