function showInTable(tyep) {
    



    let data = JSON.parse(localStorage.getItem('product') || '[]');
    let grouped = {};

    // جمع البيانات
    data.forEach(item => {
        let code = item.الكود;
        if (!grouped[code]) {
            grouped[code] = {
                datepicker: item.datepicker,
               الاسم: item.الاسم,
               المسمي: item.المسمي,
                الكود: code,
                داخل: 0,
                خارج: 0,
                totalRows: 0 // عدد الصفوف
            };
        }

        // عداد الداخل والخارج = عدد الصفوف من نوع داخل/خارج
        if (item.tyep === 'داخل') grouped[code].داخل++;
        if (item.tyep === 'خارج') grouped[code].خارج++;

    });

    // الآن نعرض الجدول
    let rows = '';
    for (let code in grouped) {
        let item = grouped[code];
        let balance = item.داخل - item.خارج;

        rows += `
        <tr>
            <td>${item.datepicker}</td>
            <td>${item.الكود}</td>
         <td>${item.المسمي}</td>
            <td>${balance}</td>
            <td>داخل: ${item.داخل}, خارج: ${item.خارج}, الرصيد: ${balance}</td>
            <td>
                <button onclick="toggleDetails('${item.الكود}', this)">تفاصيل</button>
            </td>
        </tr>`;
    }

    document.getElementById('tbodyIn').innerHTML = rows;
    
}






function shodata() {
    let tablee = '';
    let total = 0;
    let inCount = 0;
    let outCount = 0;

    for (let i = 0; i < dataprob.length; i++) {

    let rowClass = dataprob[i].tyep === 'خارج' ? 'row-out' : '';

    tablee += `
    <tr class="${rowClass}">
        <td>${dataprob[i].datepicker}</td> 
        <td>${dataprob[i].الكود}</td>
        <td>${dataprob[i].الاسم}</td> 
        <td>${dataprob[i].المسمي}</td>
        <td>${dataprob[i].tyep}</td>
        <td>
            <button class="delete-btn" onclick="deleteItem(${i})">حذف  <i class="fa-solid fa-trash-can"></i></button>
        </td>
        <td>
            <button class="ubdate-btn" onclick="updateItem(${i})">تعديل  <i class="fa-regular fa-pen-to-square"></i></button>
        </td>
    </tr>`;


       if (dataprob[i].tyep === 'داخل') inCount++;
else if (dataprob[i].tyep === 'خارج') outCount++;

    }
    

    document.getElementById('tbody').innerHTML = tablee;
    document.getElementById('totalQuantity').innerText = dataprob.length;
    document.getElementById('totalPrice').innerText = total;
    document.getElementById('typeinfo1').innerHTML = `داخل  ${inCount}   <br> خارج ${ outCount} `;
    // document.getElementById('typeinfo2').innerText =  `     :   `;
    document.getElementById('inn').innerText = ` ${inCount}`;
    document.getElementById('out').innerText = ` ${outCount}`;
    document.getElementById('balance').innerText = ` ${inCount-outCount}`;

    showInTable(); // تحديث جدول الداخل تلقائياً
}






// if (tyep === 'خارج') {
//         let totalIn = +dataprob.filter(d => d.الكود === الكود.value && d.tyep === 'داخل').reduce((sum, d) => sum + d.Number(الكمية), 0);
//         let totalOut = +dataprob.filter(d => d.الكود === الكود.value && d.tyep === 'خارج').reduce((sum, d) => sum + d.Number(الكمية), 0);
//         let balance = +totalIn - +totalOut;
//         if (!totalIn) return alert("هذا الصنف غير موجود في المخزن!");
//         if (qty > balance) return alert(`الكمية غير كافية!   الرصيد الحالي لهذا الصنف : ${balance}`);
//         console.log( totalIn)
//         console.log( totalOut)
//         console.log( balance)
       
//     }

// let rowClass = dataprob[i].tyep === 'خارج' ? 'row-out' : '';  class="${rowClass}"
  
 function toggleDetails(code, btn) {
    let currentRow = btn.closest('tr');

    // لو التفاصيل مفتوحة → اقفلها
    let nextRow = currentRow.nextElementSibling;
    if (nextRow && nextRow.classList.contains('details-row')) {
        nextRow.remove();
        btn.innerText = 'تفاصيل';
        return;
    }

    // جلب البيانات
    let data = JSON.parse(localStorage.getItem('product') || '[]');

    // تحديث المسميات حسب الكود
    data = data.map(item => ({
        ...item,
        المسمي: codeNameMap[item.الكود] || "غير معروف"
    }));

    // فلترة حسب الكود
    let details = data.filter(d => d.الكود === code);

    // =========================
    // 🔹 تجميع حسب (التاريخ + الاسم + النوع + الخارج)
    // =========================
    let grouped = {};

    details.forEach(d => {
        let key = `
            ${d.datepicker}_
            ${d.الاسم || ''}_
            ${d.tyep}_
            ${d.الخارج || ''}
        `;

        if (!grouped[key]) {
            grouped[key] = {
                ...d,
                quantity: Number(d.quantity) || 1
            };
        } else {
            grouped[key].quantity += Number(d.quantity) || 1;
        }
    });

    let inCount = 0;
    let outCount = 0;

    // إنشاء الصفوف
    let rows = Object.values(grouped).map(d => {

        if (d.tyep === 'داخل') inCount += d.quantity;
        if (d.tyep === 'خارج') outCount += d.quantity;

        let typeDisplay = d.tyep;
        if (d.tyep === 'خارج' && d.الخارج) {
            typeDisplay += ` الي ${d.الخارج}`;
        }

        let rowClass = d.tyep === 'خارج' ? 'row-out' : '';

        return `
            <tr class="${rowClass}">
                <td>${d.datepicker}</td>
                <td>${d.المسمي}</td>
                <td>${d.الاسم || ''}</td>
                <td>${d.quantity}</td>
                <td>${typeDisplay}</td>
            </tr>
        `;
    }).join('');

    // صف التفاصيل
    let detailsRow = document.createElement('tr');
    detailsRow.className = 'details-row';

    detailsRow.innerHTML = `
        <td colspan="6">
            <table style="width:100%; border:1px solid #ccc; margin-top:10px">
                <thead style="background:#eee">
                    <tr>
                        <th>التاريخ</th>
                        <th>المسمي</th>
                        <th>الاسم</th>
                        <th>الكمية</th>
                        <th>النوع</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
                <tfoot style="font-weight:bold;background:#f3f3f3">
                    <tr>
                        <td colspan="3">الإجمالي</td>
                        <td>
                            داخل ${inCount}<br>
                            خارج ${outCount}
                        </td>
                        <td>
                            الرصيد ${inCount - outCount}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </td>
    `;

    currentRow.after(detailsRow);
    btn.innerText = 'إخفاء';
}





