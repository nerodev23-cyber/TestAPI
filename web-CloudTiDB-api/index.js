const submitData = async () => {
    
    let fullNameDOM = document.querySelector('input[name=FullName]');
    let phoneNumberDOM = document.querySelector('input[name=PhoneNumber]');
    let emailDOM = document.querySelector('input[name=Email]');
    let registerDateDOM = document.querySelector('input[name=RegisterDate]');

        // ตรวจสอบค่าว่าง
    if (!fullNameDOM.value.trim() || !phoneNumberDOM.value.trim() || !emailDOM.value.trim() || !registerDateDOM.value) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        return;
    }

    // ตรวจสอบรูปแบบอีเมล
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailDOM.value)) {
        alert("รูปแบบอีเมลไม่ถูกต้อง");
        return;
    }

    // ตรวจสอบเบอร์โทรศัพท์ (ตัวเลข 9-10 หลัก)
    const phonePattern = /^[0-9]{9,10}$/;
    if (!phonePattern.test(phoneNumberDOM.value)) {
        alert("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ตัวเลข 9-10 หลัก)");
        return;
    }

    // ตรวจสอบว่าไม่เลือกวันในอนาคต
    const selectedDate = new Date(registerDateDOM.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ตัดเวลาออก
    if (selectedDate > today) {
        alert("วันที่ลงทะเบียนต้องไม่เกินวันปัจจุบัน");
        return;
    }


    let userData = {
    fullName: fullNameDOM.value,
    phoneNumber: phoneNumberDOM.value,
    email: emailDOM.value,
    registerDate: registerDateDOM.value
    };

    console.log("ข้อมูลที่รับมา =", userData);

    try{
    
        const response = await axios.post('http://localhost:8000/createuser', userData);
        console.log("response Data", response.data);

    }catch(err){
        console.log("ส่งข้อมูลไม่สำเร็จ", err);
    }

}
