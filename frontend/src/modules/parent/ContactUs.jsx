// import React, { useState } from "react";

// const ContactUs = () => {
//   const [form, setForm] = useState({
//     parentName: "",
//     studentName: "",
//     studentId: "",
//     phoneNumber: "",
//     email: "",
//     message: "",
//   });

//   const [errors, setErrors] = useState({}); 
//   const [submitted, setSubmitted] = useState(false);
//   const [touched, setTouched] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Restrict phone number input
//     if (name === "phoneNumber") {
//       // New validation: Block input if the first digit is not 6, 7, 8, or 9.
//       if (value.length === 1 && !/[6-9]/.test(value)) {
//         return; 
//       }
//       // Allow only digits and max 10 chars
//       if (!/^\d*$/.test(value)) return; // block non-digits
//       if (value.length > 10) return; // block more than 10
//     }
    
//     // Validation for names: allow only letters and spaces
//     if (name === "parentName" || name === "studentName") {
//       // Allow only letters, spaces, and common name characters (hyphens, apostrophes)
//       if (!/^[a-zA-Z\s\-']*$/.test(value)) {
//         return; // Block numbers and special characters
//       }
//     }
    
//     // Validation for studentId: allow only alphanumeric characters
//     if (name === "studentId") {
//       if (!/^[a-zA-Z0-9]*$/.test(value)) {
//         return; // Block non-alphanumeric characters
//       }
//     }

//     setForm({ ...form, [name]: value });
    
//     // Validate field as user types (only if it's been touched/blurred)
//     if (touched[name]) {
//       validateField(name, value);
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
    
//     // Mark field as touched
//     setTouched({ ...touched, [name]: true });
    
//     // Validate the field
//     validateField(name, value);
//   };

//   const validateField = (name, value) => {
//     let errorMsg = "";
    
//     if (!value.trim()) {
//       errorMsg = `${getFieldLabel(name)} is required`;
//     } else if (name === "phoneNumber") {
//       if (value.length !== 10) {
//         errorMsg = "Phone Number must be exactly 10 digits";
//       } else if (!/^[6-9]\d{9}$/.test(value)) {
//         errorMsg = "enter a valid phone number ";
//       }
//     } else if (name === "email" && !isValidEmail(value)) {
//       errorMsg = "Please enter a valid email address";
//     } else if (name === "studentId" && !/^[a-zA-Z0-9]+$/.test(value)) {
//       errorMsg = "Student ID can only contain letters and numbers";
//     } else if ((name === "parentName" || name === "studentName") && !/^[a-zA-Z\s\-']+$/.test(value)) {
//       errorMsg = "Name can only contain letters and spaces";
//     } else if ((name === "parentName" || name === "studentName") && value.trim().length < 2) {
//       errorMsg = "Name must be at least 2 characters long";
//     }
    
//     setErrors({ ...errors, [name]: errorMsg });
//   };

//   const getFieldLabel = (fieldName) => {
//     const labels = {
//       parentName: "Parent Name",
//       studentName: "Student Name",
//       studentId: "Student ID",
//       phoneNumber: "Phone Number",
//       email: "Email",
//       message: "Message"
//     };
    
//     return labels[fieldName] || fieldName;
//   };

//  const isValidEmail = (email) => {
//   // A more robust regex that checks for a standard email format
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
//   return emailRegex.test(email);
// };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Mark all fields as touched to show all errors
//     const allTouched = {};
//     Object.keys(form).forEach(key => {
//       allTouched[key] = true;
//     });
//     setTouched(allTouched);

//     // Validate all fields
//     const newErrors = {};
//     Object.keys(form).forEach(key => {
//       if (!form[key].trim()) {
//         newErrors[key] = `${getFieldLabel(key)} is required`;
//       } else if (key === "phoneNumber") {
//         if (form[key].length !== 10) {
//           newErrors[key] = "Phone Number must be exactly 10 digits";
//         } else if (!/^[6-9]\d{9}$/.test(form[key])) {
//           newErrors[key] = "Phone number must start with 6, 7, 8, or 9";
//         }
//       } else if (key === "email" && !isValidEmail(form[key])) {
//         newErrors[key] = "Please enter a valid email address";
//       } else if (key === "studentId" && !/^[a-zA-Z0-9]+$/.test(form[key])) {
//         newErrors[key] = "Student ID can only contain letters and numbers";
//       } else if ((key === "parentName" || key === "studentName") && !/^[a-zA-Z\s\-']+$/.test(form[key])) {
//         newErrors[key] = "Name can only contain letters and spaces";
//       } else if ((key === "parentName" || key === "studentName") && form[key].trim().length < 2) {
//         newErrors[key] = "Name must be at least 2 characters long";
//       }
//     });

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
      
//       // Scroll to the first error
//       const firstErrorField = Object.keys(newErrors)[0];
//       const element = document.querySelector(`[name="${firstErrorField}"]`);
//       if (element) {
//         element.focus();
//         element.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }
      
//       return;
//     }

//     setSubmitted(true);

//     // TODO: API call to send data here
//     setForm({
//       parentName: "",
//       studentName: "",
//       studentId: "",
//       phoneNumber: "",
//       email: "",
//       message: "",
//     });

//     // Reset touched state
//     setTouched({});

//     // Reset success message after 5s
//     setTimeout(() => setSubmitted(false), 5000);
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 600,
//         margin: "2rem auto",
//         background: "#fff",
//         borderRadius: 12,
//         boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//         padding: "2rem",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Contact Us</h2>
//       {submitted ? (
//         <div
//           style={{ textAlign: "center", color: "#22c55e", fontWeight: 600 }}
//         >
//           ✅ Thank you for contacting us!
//           <br />
//           We will reach out to you soon.
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} noValidate>
//           {/* Parent Name */}
//           <div style={{ marginBottom: "1rem" }}>
//             <label style={{ fontWeight: 500 }}>Parent Name *</label>
//             <input
//               type="text"
//               name="parentName"
//               placeholder="Your name"
//               value={form.parentName}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               style={{
//                 width: "100%",
//                 padding: "0.5rem",
//                 borderRadius: 6,
//                 border: errors.parentName
//                   ? "1px solid #f87171"
//                   : "1px solid #e2e8f0",
//                 marginTop: "0.25rem",
//               }}
//             />
//             {errors.parentName && (
//               <p style={{ color: "#f87171", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
//                 {errors.parentName}
//               </p>
//             )}
//           </div>

//           {/* Student Name */}
//           <div style={{ marginBottom: "1rem" }}>
//             <label style={{ fontWeight: 500 }}>Student Name *</label>
//             <input
//               type="text"
//               name="studentName"
//               placeholder="Your child's name"
//               value={form.studentName}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               style={{
//                 width: "100%",
//                 padding: "0.5rem",
//                 borderRadius: 6,
//                 border: errors.studentName
//                   ? "1px solid #f87171"
//                   : "1px solid #e2e8f0",
//                 marginTop: "0.25rem",
//               }}
//             />
//             {errors.studentName && (
//               <p style={{ color: "#f87171", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
//                 {errors.studentName}
//               </p>
//             )}
//           </div>

//           {/* Student ID */}
//           <div style={{ marginBottom: "1rem" }}>
//             <label style={{ fontWeight: 500 }}>Student ID *</label>
//             <input
//               type="text"
//               name="studentId"
//               placeholder="Student ID"
//               value={form.studentId}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               style={{
//                 width: "100%",
//                 padding: "0.5rem",
//                 borderRadius: 6,
//                 border: errors.studentId
//                   ? "1px solid #f87171"
//                   : "1px solid #e2e8f0",
//                 marginTop: "0.25rem",
//               }}
//             />
//             {errors.studentId && (
//               <p style={{ color: "#f87171", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
//                 {errors.studentId}
//               </p>
//             )}
//           </div>

//           {/* Phone Number */}
//           <div style={{ marginBottom: "1rem" }}>
//             <label style={{ fontWeight: 500 }}>Phone Number *</label>
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <span
//                 style={{
//                   padding: "0.5rem 0.75rem",
//                   background: "#f3f4f6",
//                   border: errors.phoneNumber
//                     ? "1px solid #f87171"
//                     : "1px solid #e2e8f0",
//                   borderRadius: "6px 0 0 6px",
//                   color: "#64748b",
//                   fontWeight: 500,
//                   borderRight: "none"
//                 }}
//               >
//                 +91
//               </span>
//               <input
//                 type="tel"
//                 name="phoneNumber"
//                 value={form.phoneNumber}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="10-digit number"
//                 style={{
//                   width: "100%",
//                   padding: "0.5rem",
//                   borderRadius: "0 6px 6px 0",
//                   border: errors.phoneNumber
//                     ? "1px solid #f87171"
//                     : "1px solid #e2e8f0",
//                   borderLeft: "none",
//                   marginTop: 0
//                 }}
//                 maxLength={10}
//               />
//             </div>
//             {errors.phoneNumber && (
//               <p style={{ color: "#f87171", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
//                 {errors.phoneNumber}
//               </p>
//             )}
//           </div>

//           {/* Email */}
//           <div style={{ marginBottom: "1rem" }}>
//             <label style={{ fontWeight: 500 }}>Email *</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter valid email"
//               value={form.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               style={{
//                 width: "100%",
//                 padding: "0.5rem",
//                 borderRadius: 6,
//                 border: errors.email
//                   ? "1px solid #f87171"
//                   : "1px solid #e2e8f0",
//                 marginTop: "0.25rem",
//               }}
//             />
//             {errors.email && (
//               <p style={{ color: "#f87171", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
//                 {errors.email}
//               </p>
//             )}
//           </div>

//           {/* Message */}
//           <div style={{ marginBottom: "1.5rem" }}>
//             <label style={{ fontWeight: 500 }}>Message *</label>
//             <textarea
//               name="message"
//               value={form.message}
//               placeholder="Your message"
//               onChange={handleChange}
//               onBlur={handleBlur}
//               rows={4}
//               style={{
//                 width: "100%",
//                 padding: "0.5rem",
//                 borderRadius: 6,
//                 border: errors.message
//                   ? "1px solid #f87171"
//                   : "1px solid #e2e8f0",
//                 marginTop: "0.25rem",
//                 resize: "vertical",
//               }}
//             />
//             {errors.message && (
//               <p style={{ color: "#f87171", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
//                 {errors.message}
//               </p>
//             )}
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             style={{
//               width: "100%",
//               background: "#667eea",
//               color: "#fff",
//               border: "none",
//               borderRadius: 8,
//               padding: "0.75rem",
//               fontWeight: 600,
//               fontSize: "1rem",
//               cursor: "pointer",
//             }}
//           >
//             Submit
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default ContactUs;








import React, { useState } from "react";

import { useTranslation } from "react-i18next";


 
const ContactUs = () => {

  const { t, i18n } = useTranslation();
 
  const [form, setForm] = useState({

    parentName: "",

    studentName: "",

    studentId: "",

    phoneNumber: "",

    email: "",

    message: "",

  });
 
  const [errors, setErrors] = useState({});

  const [submitted, setSubmitted] = useState(false);

  const [touched, setTouched] = useState({});
 
  const handleChange = (e) => {

    const { name, value } = e.target;
 
    // Phone validation

    if (name === "phoneNumber") {

      if (value.length === 1 && !/[6-9]/.test(value)) return;

      if (!/^\d*$/.test(value)) return;

      if (value.length > 10) return;

    }
 
    // Name validation

    if (name === "parentName" || name === "studentName") {

      if (!/^[a-zA-Z\s\-']*$/.test(value)) return;

    }
 
    // Student ID validation

    if (name === "studentId") {

      if (!/^[a-zA-Z0-9]*$/.test(value)) return;

    }
 
    setForm({ ...form, [name]: value });
 
    if (touched[name]) validateField(name, value);

  };
 
  const handleBlur = (e) => {

    const { name, value } = e.target;

    setTouched({ ...touched, [name]: true });

    validateField(name, value);

  };
 
  const validateField = (name, value) => {

    let errorMsg = "";
 
    if (!value.trim()) {

      errorMsg = t("errors.required", { field: t(name) });

    } else if (name === "phoneNumber") {

      if (value.length !== 10 || !/^[6-9]\d{9}$/.test(value)) {

        errorMsg = t("errors.phoneInvalid");

      }

    } else if (name === "email" && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value)) {

      errorMsg = t("errors.emailInvalid");

    } else if (name === "studentId" && !/^[a-zA-Z0-9]+$/.test(value)) {

      errorMsg = t("errors.studentIdInvalid");

    } else if ((name === "parentName" || name === "studentName") && !/^[a-zA-Z\s\-']+$/.test(value)) {

      errorMsg = t("errors.nameInvalid");

    } else if ((name === "parentName" || name === "studentName") && value.trim().length < 2) {

      errorMsg = t("errors.nameTooShort");

    }
 
    setErrors({ ...errors, [name]: errorMsg });

  };
 
  const handleSubmit = (e) => {

    e.preventDefault();
 
    const allTouched = {};

    Object.keys(form).forEach((key) => (allTouched[key] = true));

    setTouched(allTouched);
 
    const newErrors = {};

    Object.keys(form).forEach((key) => validateField(key, form[key]));

    Object.keys(errors).forEach((key) => {

      if (errors[key]) newErrors[key] = errors[key];

    });
 
    if (Object.keys(newErrors).length > 0) {

      setErrors(newErrors);

      const firstErrorField = Object.keys(newErrors)[0];

      const element = document.querySelector(`[name="${firstErrorField}"]`);

      if (element) element.focus();

      return;

    }
 
    setSubmitted(true);

    setForm({ parentName: "", studentName: "", studentId: "", phoneNumber: "", email: "", message: "" });

    setTouched({});

    setTimeout(() => setSubmitted(false), 5000);

  };
 
  return (
 <div style={{ maxWidth: 600, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.08)", padding: "2rem" }}>

 
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>{t("title")}</h2>
 
      {submitted ? (
<div style={{ textAlign: "center", color: "#22c55e", fontWeight: 600 }}>{t("successMessage")}</div>

      ) : (
<form onSubmit={handleSubmit} noValidate>

          {["parentName", "studentName", "studentId", "phoneNumber", "email", "message"].map((field) => (
<div key={field} style={{ marginBottom: "1rem" }}>
<label style={{ fontWeight: 500 }}>{t(field)} *</label>

              {field === "message" ? (
<textarea

                  name={field}

                  value={form[field]}

                  placeholder={t(field + "Placeholder")}

                  onChange={handleChange}

                  onBlur={handleBlur}

                  rows={4}

                  style={{

                    width: "100%",

                    padding: "0.5rem",

                    borderRadius: 6,

                    border: errors[field] ? "1px solid #f87171" : "1px solid #e2e8f0",

                    marginTop: "0.25rem",

                    resize: "vertical",

                  }}

                />

              ) : field === "phoneNumber" ? (
<div style={{ display: "flex", alignItems: "center" }}>
<span

                    style={{

                      padding: "0.5rem 0.75rem",

                      background: "#f3f4f6",

                      border: errors[field] ? "1px solid #f87171" : "1px solid #e2e8f0",

                      borderRadius: "6px 0 0 6px",

                      color: "#64748b",

                      fontWeight: 500,

                      borderRight: "none",

                    }}
>

                    +91
</span>
<input

                    type="tel"

                    name={field}

                    value={form[field]}

                    placeholder={t(field + "Placeholder")}

                    onChange={handleChange}

                    onBlur={handleBlur}

                    maxLength={10}

                    style={{

                      width: "100%",

                      padding: "0.5rem",

                      borderRadius: "0 6px 6px 0",

                      border: errors[field] ? "1px solid #f87171" : "1px solid #e2e8f0",

                      borderLeft: "none",

                      marginTop: 0,

                    }}

                  />
</div>

              ) : (
<input

                  type={field === "email" ? "email" : "text"}

                  name={field}

                  value={form[field]}

                  placeholder={t(field + "Placeholder")}

                  onChange={handleChange}

                  onBlur={handleBlur}

                  style={{

                    width: "100%",

                    padding: "0.5rem",

                    borderRadius: 6,

                    border: errors[field] ? "1px solid #f87171" : "1px solid #e2e8f0",

                    marginTop: "0.25rem",

                  }}

                />

              )}

              {errors[field] && <p style={{ color: "#f87171", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>{errors[field]}</p>}
</div>

          ))}
 
          <button

            type="submit"

            style={{

              width: "100%",

              background: "#667eea",

              color: "#fff",

              border: "none",

              borderRadius: 8,

              padding: "0.75rem",

              fontWeight: 600,

              fontSize: "1rem",

              cursor: "pointer",

            }}
>

            {t("submit")}
</button>
</form>

      )}
</div>

  );

};
 
export default ContactUs;

 