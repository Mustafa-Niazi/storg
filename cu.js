






//  let codee = document.getElementById('codee');
// let namee = document.getElementById('namee');
// let codeLists = document.getElementById('codeLists');
// let save = document.getElementById('save');
//  let modee='create';

// let tmpt = null;

// // تحميل البيانات من localStorage
// let dataproo = localStorage.codee
//     ? JSON.parse(localStorage.codee)
//     : [];

// // عرض أولي
// showdataa();
// fillSelect();


// // حفظ
// function savea(){
//     if(codee.value === '' || namee.value === ''){
//         alert("املأ البيانات");
//         return;
//     }
    
//     let newdataa = {
//         codee: codee.value,
//         namee: namee.value,
//     };
//     if(modee==='create'){

//     dataproo.push(newdataa);
       


//     }
//     else{


//         dataproo[tmpp]=newdataa;
//          modee='create';
//           save.innerHTML='save'
//     }


//     localStorage.codee = JSON.stringify(dataproo);

//     clearInputs();
//     showdataa();
//     fillSelect();
// }

// // عرض الجدول
// function showdataa(){
//     let tablee = '';

//     for(let i = 0; i < dataproo.length; i++){
//         tablee += `
//         <tr>
//             <td>${dataproo[i].namee}</td>
//             <td>${dataproo[i].codee}</td>
//             <td><button class="delete-btn" onclick="deleti(${i})"> حذف   <i class="fa-solid fa-trash-can"></i></button></td>
//             <td><button class="ubdate-btn"  onclick="edit(${i})">تعديل  <i class="fa-regular fa-pen-to-square"></i></button></td>
//         </tr>`;
//     }

//     document.getElementById('tbodyy').innerHTML = tablee;
// }

// // تعبئة الـ select من localStorage
// function fillSelect(){
//     codeLists.innerHTML = '';

//     for(let i = 0; i < dataproo.length; i++){
//         let option = document.createElement("option");
//         option.textContent = dataproo[i].codee;
//         codeLists.appendChild(option);
//     }
// }

// // حذف
// function deleti(i){
//     dataproo.splice(i, 1);
//     localStorage.codee = JSON.stringify(dataproo);

//     showdataa();
//     fillSelect();
// }

// // تعديل
// function edit(i){
//     save.innerHTML='edit'
//     modee='edit'
//     tmpt = i;
//     codee.value = dataproo[i].codee;
//     namee.value = dataproo[i].namee;
// }

// // تنظيف الانبوتات
// function clearInputs(){
//     codee.value = '';
//     namee.value = '';
// }



