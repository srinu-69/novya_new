
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

 