import { useState } from 'react'
import './App.css'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function App() {

  const [formData, setFormData] = useState({
    patientName: '',
    guardianName: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    reason: ''
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [patients, setPatients] = useState([])

  // =========================
  // ADMIN STATE
  // =========================

  const [showAdmin, setShowAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)

  const [showLogin, setShowLogin] = useState(false)

  const [adminUsername, setAdminUsername] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  const [adminLoggedIn, setAdminLoggedIn] = useState(false)

  const [adminError, setAdminError] = useState('')

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (event) => {

    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  // =========================
  // PATIENT REGISTRATION
  // =========================

  const handleSubmit = async (event) => {

    event.preventDefault()

    setMessage('')
    setError('')

    try {

      const response = await fetch(
        `${API_URL}/patients`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({

            patient_name: formData.patientName,
            guardian_name: formData.guardianName,
            age: Number(formData.age),
            gender: formData.gender,
            phone: formData.phone,
            address: formData.address,
            reason: formData.reason

          })
        }
      )

      const data = await response.json()

      if (!response.ok) {

        throw new Error(
          data.detail || 'Registration failed'
        )
      }

      setMessage(
        `Patient registered successfully! Registration ID: ${data.patient_id}`
      )

      setFormData({

        patientName: '',
        guardianName: '',
        age: '',
        gender: '',
        phone: '',
        address: '',
        reason: ''

      })

    } catch (error) {

      setError(
        'Unable to register patient. Please make sure the backend server is running.'
      )

      console.error(error)
    }
  }

  // =========================
  // OPEN ADMIN LOGIN
  // =========================

  const openAdminLogin = () => {

    setAdminError('')
    setAdminUsername('')
    setAdminPassword('')

    setShowLogin(true)
  }

  // =========================
  // ADMIN LOGIN
  // =========================

  const handleAdminLogin = async (event) => {

    event.preventDefault()

    setAdminError('')
    setAdminLoading(true)

    try {

      const authHeader =
        'Basic ' +
        btoa(
          `${adminUsername}:${adminPassword}`
        )

      const response = await fetch(
        `${API_URL}/admin/login`,
        {
          method: 'GET',

          headers: {
            Authorization: authHeader
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {

        throw new Error(
          data.detail || 'Invalid admin username or password'
        )
      }

      setAdminLoggedIn(true)
      setShowLogin(false)

      await loadPatients(authHeader)

    } catch (error) {

      console.error(error)

      setAdminError(
        'Invalid admin username or password.'
      )

    } finally {

      setAdminLoading(false)
    }
  }

  // =========================
  // LOAD PATIENTS
  // =========================

  const loadPatients = async (authHeader) => {

    setAdminLoading(true)

    try {

      const response = await fetch(
        `${API_URL}/patients`,
        {
          method: 'GET',

          headers: {
            Authorization: authHeader
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {

        throw new Error(
          data.detail || 'Failed to load patients'
        )
      }

      setPatients(data)
      setShowAdmin(true)

    } catch (error) {

      console.error(error)

      alert(
        'Unable to load patient records. Please make sure backend is running.'
      )

    } finally {

      setAdminLoading(false)
    }
  }

  // =========================
  // ADMIN LOGOUT
  // =========================

  const handleAdminLogout = () => {

    setPatients([])
    setShowAdmin(false)
    setAdminLoggedIn(false)

    setAdminUsername('')
    setAdminPassword('')
    setAdminError('')
  }

  return (
    <div className="app">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">

        <div className="nav-container">

          <a href="#home" className="logo">

            <span className="logo-name">
              Prof. Dr.M. Azam Khan
            </span>

            <span className="logo-subtitle">
              Pediatrician & Child Specialist
            </span>

          </a>

          <nav className="nav-links">

            <a href="#home">Home</a>

            <a href="#doctor">About Doctor</a>

            <a href="#services">Services</a>

            <a href="#camps">Medical Camps</a>

            <a href="#gallery">Gallery</a>

            <a href="#contact">Contact</a>

            <a
              href="#appointment"
              className="nav-register"
            >
              Patient Registration
            </a>

          </nav>

        </div>

      </header>


      {/* =========================
          HERO
      ========================= */}

      <main>

        <section id="home" className="hero">

          <div className="hero-container">

            <div className="hero-content">

              <span className="eyebrow">
                PROFESSIONAL CHILD HEALTHCARE
              </span>

              <h1>
                Prof. Dr.M. Azam Khan
              </h1>

              <h2>
                Senior Pediatrician & Child Specialist
              </h2>

              <p>
                Dedicated to providing quality healthcare,
                professional medical guidance, and compassionate
                care for children and families.
              </p>

              <div className="hero-buttons">

                <a
                  href="#appointment"
                  className="btn btn-primary"
                >
                  Register as Patient
                </a>

                <a
                  href="#doctor"
                  className="btn btn-secondary"
                >
                  Meet Prof. Dr.M. Azam Khan
                </a>

              </div>

              <div className="hero-trust">

                <div>
                  <strong>35+</strong>
                  <span>Years Experience</span>
                </div>

                <div>
                  <strong>Every Sunday</strong>
                  <span>Free Medical Camp</span>
                </div>

                <div>
                  <strong>Child Care</strong>
                  <span>Professional Guidance</span>
                </div>

              </div>

            </div>

            <div className="hero-doctor-card">

              <div className="doctor-photo-placeholder">

                <img
                  src="/images/doctor/doctor-photo.jpeg"
                  alt="Prof. Dr.M. Azam Khan"
                />

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            ABOUT / PERSONALITY
        ========================= */}

        <section id="doctor" className="section">

          <div className="section-container">

            <div className="section-heading">

              <span className="eyebrow">
                ABOUT PROF. DR. AZAM KHAN
              </span>

              <h2>
                A Dedicated Pediatrician & Child Specialist
              </h2>

            </div>

            <div className="about-grid">

              <div className="about-text">

                <p>
                  Prof. Dr. Azam Khan is a dedicated,
                  compassionate, and experienced Pediatrician
                  & Child Specialist, known for his sincere
                  commitment to the health and well-being of
                  children and families.
                </p>

                <p>
                  With more than 35 years of professional
                  medical experience, he has devoted a
                  significant part of his life to serving
                  patients with dedication, patience, and a
                  strong sense of responsibility.
                </p>

                <p>
                  His professional personality reflects a
                  combination of medical knowledge, practical
                  experience, kindness, and a deep understanding
                  of the concerns faced by parents regarding
                  their children's health.
                </p>

                <p>
                  He believes that treating a child is not
                  only about diagnosing an illness and
                  prescribing medicine, but also about listening
                  carefully to parents, understanding the
                  child's individual needs, providing proper
                  guidance, and creating an environment where
                  families feel comfortable and confident.
                </p>

                <p>
                  His calm and respectful attitude allows him
                  to communicate effectively with patients and
                  their families, while his extensive experience
                  supports a careful and professional approach
                  to pediatric healthcare.
                </p>

                <h3>
                  Professional Medical Experience
                </h3>

                <p>
                  Prof. Dr. Azam Khan holds MBBS and FCPS
                  (Paediatrics) qualifications and has extensive
                  experience in pediatric care and child
                  healthcare.
                </p>

                <p>
                  He has served in academic and leadership roles
                  including Dean of Medicine and Allied
                  Specialties and Chairman & HOD, Pediatrics at
                  Nishtar Medical University & Hospital, Multan.
                </p>

                <h3>
                  Commitment to Community Healthcare
                </h3>

                <p>
                  Beyond his clinical responsibilities,
                  Prof. Dr. Azam Khan has also demonstrated a
                  strong commitment to community welfare and
                  accessible healthcare through free medical
                  initiatives.
                </p>

                <p>
                  Through the weekly Medical Dada Dadi Camp at
                  Nalka Ada, Head Panjnad, free check-ups,
                  medicines, and medical guidance are provided
                  every Sunday.
                </p>

                <p>
                  His professional values emphasize compassion,
                  honesty, service, professionalism, and
                  humanity. For him, medicine represents a
                  responsibility to serve humanity, protect the
                  health of children, support families, and
                  contribute positively to the community.
                </p>

                <a
                  href="#contact"
                  className="btn btn-primary"
                >
                  Contact Prof. Dr. Azam Khan →
                </a>

              </div>


              <div className="about-highlights">

                <div className="about-highlight">
                  <strong>MBBS</strong>
                  <span>Medical Qualification</span>
                </div>

                <div className="about-highlight">
                  <strong>FCPS</strong>
                  <span>Paediatrics</span>
                </div>

                <div className="about-highlight">
                  <strong>35+</strong>
                  <span>Years Experience</span>
                </div>

                <div className="about-highlight">
                  <strong>Child</strong>
                  <span>Healthcare Specialist</span>
                </div>

                <div className="about-highlight">
                  <strong>Dean</strong>
                  <span>Medicine & Allied Specialties</span>
                </div>

                <div className="about-highlight">
                  <strong>Chairman & HOD</strong>
                  <span>Pediatrics</span>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            QUALIFICATIONS & EXPERIENCE
        ========================= */}

        <section className="section">

          <div className="section-container">

            <div className="section-heading center">

              <span className="eyebrow">
                QUALIFICATIONS & EXPERIENCE
              </span>

              <h2>
                Professional Background
              </h2>

            </div>

            <div className="qualification-grid">

              <div className="qualification-card">

                <span className="qualification-number">
                  01
                </span>

                <h3>
                  MBBS
                </h3>

                <p>
                  Bachelor of Medicine and Bachelor of Surgery.
                </p>

              </div>


              <div className="qualification-card">

                <span className="qualification-number">
                  02
                </span>

                <h3>
                  FCPS (Paediatrics)
                </h3>

                <p>
                  Fellowship qualification in Paediatrics.
                </p>

              </div>


              <div className="qualification-card">

                <span className="qualification-number">
                  03
                </span>

                <h3>
                  Dean of Medicine
                </h3>

                <p>
                  Dean of Medicine and Allied Specialties.
                </p>

              </div>


              <div className="qualification-card">

                <span className="qualification-number">
                  04
                </span>

                <h3>
                  Chairman & HOD
                </h3>

                <p>
                  Chairman & HOD, Pediatrics at Nishtar
                  Medical University & Hospital, Multan.
                </p>

              </div>


              <div className="qualification-card">

                <span className="qualification-number">
                  05
                </span>

                <h3>
                  Controller & Examination Incharge
                </h3>

                <p>
                  Controller & Examination Incharge
                  responsibilities in the academic and
                  medical education environment.
                </p>

              </div>


              <div className="qualification-card">

                <span className="qualification-number">
                  06
                </span>

                <h3>
                  35+ Years Experience
                </h3>

                <p>
                  More than 35 years of professional
                  medical experience in pediatric healthcare.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            SERVICES
        ========================= */}

        <section id="services" className="section">

          <div className="section-container">

            <div className="section-heading center">

              <span className="eyebrow">
                MEDICAL SERVICES
              </span>

              <h2>
                Child Healthcare With Care & Trust
              </h2>

              <p>
                Professional pediatric healthcare,
                medical guidance, and patient-focused
                support for children and families.
              </p>

            </div>

            <div className="services-grid">

              <div className="service-card">

                <div className="service-icon">
                  +
                </div>

                <h3>
                  Medical Consultation
                </h3>

                <p>
                  Professional pediatric consultation
                  and medical guidance for children
                  and families.
                </p>

              </div>


              <div className="service-card">

                <div className="service-icon">
                  ♥
                </div>

                <h3>
                  Child Healthcare
                </h3>

                <p>
                  Patient-focused healthcare and
                  professional guidance for children's
                  health needs.
                </p>

              </div>


              <div className="service-card">

                <div className="service-icon">
                  ✚
                </div>

                <h3>
                  Medical Camps
                </h3>

                <p>
                  Free medical check-ups, medicines,
                  and medical guidance through community
                  healthcare activities.
                </p>

              </div>


              <div className="service-card">

                <div className="service-icon">
                  ✓
                </div>

                <h3>
                  Health Guidance
                </h3>

                <p>
                  Professional medical guidance and
                  general healthcare information for
                  children and families.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            MEDICAL CAMP
        ========================= */}

        <section
          id="camps"
          className="section camp-section"
        >

          <div className="section-container">

            <div className="section-heading center">

              <span className="eyebrow">
                COMMUNITY SERVICE
              </span>

              <h2>
                Free Medical Dada Dadi Camp
              </h2>

            </div>

            <div className="camp-card">

              <h3>
                Nalka Ada, Head Panjnad
              </h3>

              <div className="camp-location">
                Every Sunday — Free Medical Camp
              </div>

              <p>
                Prof. Dr.M. Azam Khan provides free healthcare
                services every Sunday through the Free Medical
                Dada Dadi Camp.
              </p>

              <div className="camp-features">

                <div className="camp-feature">

                  <strong>
                    🩺 Free Medical Check-up
                  </strong>

                  <span>
                    Professional medical examination and guidance.
                  </span>

                </div>


                <div className="camp-feature">

                  <strong>
                    💊 Free Medicines
                  </strong>

                  <span>
                    Free medicines for patients at the camp.
                  </span>

                </div>


                <div className="camp-feature">

                  <strong>
                    📋 Free Medical Guidance
                  </strong>

                  <span>
                    Medical guidance and consultation for families.
                  </span>

                </div>

              </div>

              <p>
                Our aim is to make quality healthcare accessible
                to children and families in need.
              </p>

              <a
                href="#gallery"
                className="btn btn-primary"
              >
                View Camp Gallery
              </a>

            </div>

          </div>

        </section>


        {/* =========================
            GALLERY
        ========================= */}

        <section id="gallery" className="section">

          <div className="section-container">

            <div className="section-heading center">

              <span className="eyebrow">
                GALLERY
              </span>

              <h2>
                Medical Camps Gallery
              </h2>

              <p>
                Photos from Prof. Dr.M. Azam Khan's medical camps
                and community healthcare activities.
              </p>

            </div>

            <div className="gallery-grid">

              {Array.from(
                { length: 20 },
                (_, index) => {

                  const number =
                    String(index + 1).padStart(2, '0')

                  return (

                    <div
                      className="gallery-item"
                      key={number}
                    >

                      <img
                        src={`/images/camps/camp-${number}.jpeg`}
                        alt={`Medical Camp ${number}`}
                      />

                    </div>

                  )

                }
              )}

            </div>

          </div>

        </section>


        {/* =========================
            PATIENT REGISTRATION
        ========================= */}

        <section
          id="appointment"
          className="section registration-section"
        >

          <div className="section-container">

            <div className="registration-box">

              <div className="registration-intro">

                <span className="eyebrow">
                  PATIENT SERVICES
                </span>

                <h2>
                  Patient Registration
                </h2>

                <p>
                  Please provide your basic information to register
                  as a patient. Our team can use this information
                  for medical consultation and appointment coordination.
                </p>

              </div>


              <form
                className="registration-form"
                onSubmit={handleSubmit}
              >

                <div className="form-group">

                  <label>
                    Patient Name
                  </label>

                  <input
                    type="text"
                    name="patientName"
                    placeholder="Enter patient name"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Father / Guardian Name
                  </label>

                  <input
                    type="text"
                    name="guardianName"
                    placeholder="Enter father or guardian name"
                    value={formData.guardianName}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Age
                    </label>

                    <input
                      type="number"
                      name="age"
                      placeholder="Enter age"
                      min="0"
                      value={formData.age}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Gender
                    </label>

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >

                      <option
                        value=""
                        disabled
                      >
                        Select gender
                      </option>

                      <option value="male">
                        Male
                      </option>

                      <option value="female">
                        Female
                      </option>

                      <option value="other">
                        Other
                      </option>

                    </select>

                  </div>

                </div>


                <div className="form-group">

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="03XX XXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Reason for Visit
                  </label>

                  <textarea
                    name="reason"
                    rows="5"
                    placeholder="Briefly describe the reason for consultation"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  ></textarea>

                </div>


                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit Registration
                </button>


                {message && (

                  <p className="registration-success">
                    {message}
                  </p>

                )}


                {error && (

                  <p className="registration-error">
                    {error}
                  </p>

                )}

              </form>

            </div>

          </div>

        </section>


        {/* =========================
            ADMIN PATIENT DASHBOARD
        ========================= */}

        <section
          id="admin-dashboard"
          className="section"
        >

          <div className="section-container">

            <div className="section-heading center">

              <span className="eyebrow">
                ADMINISTRATION
              </span>

              <h2>
                Patient Records Dashboard
              </h2>

              <p>
                Authorized administration panel for viewing
                registered patient records.
              </p>

            </div>


            {!adminLoggedIn && (

              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '30px'
                }}
              >

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openAdminLogin}
                >
                  🔐 Admin Login
                </button>

              </div>

            )}


            {showLogin && (

              <div
                style={{
                  maxWidth: '450px',
                  margin: '0 auto 35px',
                  padding: '30px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                }}
              >

                <h3
                  style={{
                    textAlign: 'center',
                    marginBottom: '10px'
                  }}
                >
                  Admin Login
                </h3>

                <p
                  style={{
                    textAlign: 'center',
                    marginBottom: '25px',
                    color: '#666'
                  }}
                >
                  Authorized access only
                </p>


                <form
                  onSubmit={handleAdminLogin}
                >

                  <div className="form-group">

                    <label>
                      Username
                    </label>

                    <input
                      type="text"
                      placeholder="Enter admin username"
                      value={adminUsername}
                      onChange={(event) =>
                        setAdminUsername(event.target.value)
                      }
                      required
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Password
                    </label>

                    <input
                      type="password"
                      placeholder="Enter admin password"
                      value={adminPassword}
                      onChange={(event) =>
                        setAdminPassword(event.target.value)
                      }
                      required
                    />

                  </div>


                  {adminError && (

                    <p
                      style={{
                        color: '#dc2626',
                        textAlign: 'center',
                        marginBottom: '15px'
                      }}
                    >
                      {adminError}
                    </p>

                  )}


                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      justifyContent: 'center'
                    }}
                  >

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={adminLoading}
                    >
                      {adminLoading
                        ? 'Signing In...'
                        : 'Sign In'}
                    </button>


                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowLogin(false)
                        setAdminError('')
                      }}
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              </div>

            )}


            {adminLoggedIn && showAdmin && (

              <div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '15px',
                    flexWrap: 'wrap',
                    marginBottom: '25px'
                  }}
                >

                  <strong>
                    🔒 Admin Access — Patient Records
                  </strong>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleAdminLogout}
                  >
                    Logout
                  </button>

                </div>


                <div
                  style={{
                    overflowX: 'auto'
                  }}
                >

                  <div
                    style={{
                      marginBottom: '20px',
                      textAlign: 'center'
                    }}
                  >

                    <strong>
                      Total Registered Patients: {patients.length}
                    </strong>

                  </div>


                  {patients.length === 0 ? (

                    <p
                      style={{
                        textAlign: 'center'
                      }}
                    >
                      No patients registered yet.
                    </p>

                  ) : (

                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        background: '#ffffff'
                      }}
                    >

                      <thead>

                        <tr>

                          <th style={{
                            padding: '12px',
                            border: '1px solid #ddd'
                          }}>
                            ID
                          </th>

                          <th style={{
                            padding: '12px',
                            border: '1px solid #ddd'
                          }}>
                            Patient
                          </th>

                          <th style={{
                            padding: '12px',
                            border: '1px solid #ddd'
                          }}>
                            Guardian
                          </th>

                          <th style={{
                            padding: '12px',
                            border: '1px solid #ddd'
                          }}>
                            Age
                          </th>

                          <th style={{
                            padding: '12px',
                            border: '1px solid #ddd'
                          }}>
                            Gender
                          </th>

                          <th style={{
                            padding: '12px',
                            border: '1px solid #ddd'
                          }}>
                            Phone
                          </th>

                          <th style={{
                            padding: '12px',
                            border: '1px solid #ddd'
                          }}>
                            Address
                          </th>

                          <th style={{
                            padding: '12px',
                            border: '1px solid #ddd'
                          }}>
                            Reason
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {patients.map((patient) => (

                          <tr key={patient.id}>

                            <td style={{
                              padding: '12px',
                              border: '1px solid #ddd'
                            }}>
                              {patient.id}
                            </td>

                            <td style={{
                              padding: '12px',
                              border: '1px solid #ddd'
                            }}>
                              {patient.patient_name}
                            </td>

                            <td style={{
                              padding: '12px',
                              border: '1px solid #ddd'
                            }}>
                              {patient.guardian_name}
                            </td>

                            <td style={{
                              padding: '12px',
                              border: '1px solid #ddd'
                            }}>
                              {patient.age}
                            </td>

                            <td style={{
                              padding: '12px',
                              border: '1px solid #ddd'
                            }}>
                              {patient.gender}
                            </td>

                            <td style={{
                              padding: '12px',
                              border: '1px solid #ddd'
                            }}>
                              {patient.phone}
                            </td>

                            <td style={{
                              padding: '12px',
                              border: '1px solid #ddd'
                            }}>
                              {patient.address}
                            </td>

                            <td style={{
                              padding: '12px',
                              border: '1px solid #ddd'
                            }}>
                              {patient.reason}
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  )}

                </div>

              </div>

            )}

          </div>

        </section>


        {/* =========================
            CONTACT
        ========================= */}

        <section id="contact" className="section">

          <div className="section-container">

            <div className="section-heading center">

              <span className="eyebrow">
                GET IN TOUCH
              </span>

              <h2>
                Contact Prof. Dr.M. Azam Khan
              </h2>

              <p>
                For medical information and patient-related inquiries,
                contact Prof. Dr.M. Azam Khan using the information below.
              </p>

            </div>


            <div className="contact-grid">

              <div className="contact-card">

                <div className="service-icon">
                  📞
                </div>

                <h3>
                  Phone
                </h3>

                <p>

                  <a href="tel:03036665222">
                    0303 6665222
                  </a>

                </p>

              </div>


              <div className="contact-card">

                <div className="service-icon">
                  🏥
                </div>

                <h3>
                  Hospitals
                </h3>

                <p>

                  Nishtar Hospital, Multan

                  <br />

                  8:00 AM – 2:00 PM

                  <br />

                  City Hospital, Multan

                  <br />

                  4:00 PM – 10:00 PM

                </p>

              </div>


              <div className="contact-card">

                <div className="service-icon">
                  👨‍⚕️
                </div>

                <h3>
                  Specialization
                </h3>

                <p>

                  Senior Pediatrician

                  <br />

                  & Child Specialist

                </p>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">

        <strong>
          Prof. Dr.M. Azam Khan
        </strong>

        <p>
          Senior Pediatrician & Child Specialist
        </p>

        <p>
          © 2026 Prof. Dr.M. Azam Khan. All rights reserved.
        </p>

      </footer>

    </div>
  )
}

export default App