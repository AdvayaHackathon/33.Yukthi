// Main JavaScript file for client-side functionality

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  // Navigation handling
  const navLinks = document.querySelectorAll("nav a")
  const contentSections = document.querySelectorAll(".content-section")

  // Handle navigation clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("data-target")

      // Hide all sections
      contentSections.forEach((section) => {
        section.classList.remove("active")
      })

      // Show target section
      document.getElementById(targetId).classList.add("active")

      // Update active nav link
      navLinks.forEach((link) => link.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Load beaches for dropdown
  fetchBeaches()

  // Form submission handlers
  const stayForm = document.getElementById("add-stay-form")
  if (stayForm) {
    stayForm.addEventListener("submit", handleStayFormSubmit)
  }

  // Restaurant form submission handler
  const restaurantForm = document.getElementById("add-restaurant-form")
  if (restaurantForm) {
    restaurantForm.addEventListener("submit", handleRestaurantFormSubmit)
  }

  // Artcraft form submission handler
  const artcraftForm = document.getElementById("add-artcraft-form")
  if (artcraftForm) {
    artcraftForm.addEventListener("submit", handleArtcraftFormSubmit)
  }

  // Guide form submission handler
  const guideForm = document.getElementById("add-guide-form")
  if (guideForm) {
    guideForm.addEventListener("submit", handleGuideFormSubmit)
  }

  // Event form submission handler
  const eventForm = document.getElementById("add-event-form")
  if (eventForm) {
    eventForm.addEventListener("submit", handleEventFormSubmit)
  }

  // Ad form submission handler
  const adForm = document.getElementById("add-ad-form")
  if (adForm) {
    adForm.addEventListener("submit", handleAdFormSubmit)
  }

  // Activity form submission handler
  const activityForm = document.getElementById("add-activity-form")
  if (activityForm) {
    activityForm.addEventListener("submit", handleActivityFormSubmit)
  }
})

// Replace the fetchBeaches function with this simplified version
// Fetch beaches from the database
async function fetchBeaches() {
  try {
    console.log("Fetching beaches from API...")
    const response = await fetch("/api/beaches")

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const beaches = await response.json()
    console.log("Beaches fetched successfully:", beaches)

    // Populate beach dropdowns
    const beachSelects = document.querySelectorAll(".beach-select")
    beachSelects.forEach((select) => {
      select.innerHTML = '<option value="">Select a beach</option>'

      if (beaches && beaches.length > 0) {
        beaches.forEach((beach) => {
          const option = document.createElement("option")
          option.value = beach._id
          option.textContent = beach.name
          select.appendChild(option)
        })
        console.log("Beach options added to dropdowns")
      } else {
        console.warn("No beaches found in the database")
        const option = document.createElement("option")
        option.disabled = true
        option.textContent = "No beaches available"
        select.appendChild(option)
      }
    })
  } catch (error) {
    console.error("Error fetching beaches:", error)
    alert("Failed to load beaches: " + error.message)

    // Add a fallback option to show there was an error
    const beachSelects = document.querySelectorAll(".beach-select")
    beachSelects.forEach((select) => {
      select.innerHTML = '<option value="">Error loading beaches</option>'
    })
  }
}

// Handle stay form submission
async function handleStayFormSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  
  // Log the form data for debugging
  console.log("Form data being submitted:", Object.fromEntries(formData))

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalBtnText = submitBtn.textContent
  submitBtn.textContent = "Saving..."
  submitBtn.disabled = true

  try {
    const response = await fetch("/api/stays", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (response.ok) {
      showNotification("Stay added successfully!", "success")
      form.reset()
      
      // If payment is needed, show payment section instead of redirecting
      if (result.requiresPayment) {
        // Hide all sections
        document.querySelectorAll(".content-section").forEach((section) => {
          section.classList.remove("active")
        })
        
        // Show payment section
        const paymentSection = document.getElementById("payment")
        paymentSection.classList.add("active")
        
        // Set the payment amount
        document.getElementById("payment-amount").value = formData.get("paymentAmount")
        
        // Store the entity ID and type for payment processing
        localStorage.setItem("pendingPayment", JSON.stringify({
          entityId: result.stayId,
          entityType: "Stay",
          amount: formData.get("paymentAmount")
        }))
        
        // Update UI to show we're in payment mode
        document.querySelector(".section-title h2").textContent = "Complete Payment"
        document.querySelector(".section-title p").textContent = "Finalize your listing by completing the payment"
      }
    } else {
      showNotification(result.message || "Failed to add stay", "error")
    }
  } catch (error) {
    console.error("Error adding stay:", error)
    showNotification("An error occurred. Please try again.", "error")
  } finally {
    // Reset button state
    submitBtn.textContent = originalBtnText
    submitBtn.disabled = false
  }
}

// Handle restaurant form submission
async function handleRestaurantFormSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  
  // Log the form data for debugging
  console.log("Restaurant form data being submitted:", Object.fromEntries(formData))

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalBtnText = submitBtn.textContent
  submitBtn.textContent = "Saving..."
  submitBtn.disabled = true

  try {
    const response = await fetch("/api/restaurants", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (response.ok) {
      showNotification("Restaurant added successfully!", "success")
      form.reset()
      
      // If payment is needed, show payment section instead of redirecting
      if (result.requiresPayment) {
        // Hide all sections
        document.querySelectorAll(".content-section").forEach((section) => {
          section.classList.remove("active")
        })
        
        // Show payment section
        const paymentSection = document.getElementById("payment")
        paymentSection.classList.add("active")
        
        // Set the payment amount
        document.getElementById("payment-amount").value = formData.get("paymentAmount")
        
        // Store the entity ID and type for payment processing
        localStorage.setItem("pendingPayment", JSON.stringify({
          entityId: result.restaurantId,
          entityType: "Restaurant",
          amount: formData.get("paymentAmount")
        }))
        
        // Update UI to show we're in payment mode
        document.querySelector(".section-title h2").textContent = "Complete Payment"
        document.querySelector(".section-title p").textContent = "Finalize your restaurant listing by completing the payment"
      }
    } else {
      showNotification(result.message || "Failed to add restaurant", "error")
    }
  } catch (error) {
    console.error("Error adding restaurant:", error)
    showNotification("An error occurred. Please try again.", "error")
  } finally {
    // Reset button state
    submitBtn.textContent = originalBtnText
    submitBtn.disabled = false
  }
}

// Handle artcraft form submission
async function handleArtcraftFormSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  
  // Log the form data for debugging
  console.log("Artcraft form data being submitted:", Object.fromEntries(formData))

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalBtnText = submitBtn.textContent
  submitBtn.textContent = "Saving..."
  submitBtn.disabled = true

  try {
    const response = await fetch("/api/artifacts", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (response.ok) {
      showNotification("Artcraft product added successfully!", "success")
      form.reset()
      
      // If payment is needed, show payment section instead of redirecting
      if (result.requiresPayment) {
        // Hide all sections
        document.querySelectorAll(".content-section").forEach((section) => {
          section.classList.remove("active")
        })
        
        // Show payment section
        const paymentSection = document.getElementById("payment")
        paymentSection.classList.add("active")
        
        // Set the payment amount
        document.getElementById("payment-amount").value = formData.get("paymentAmount")
        
        // Store the entity ID and type for payment processing
        localStorage.setItem("pendingPayment", JSON.stringify({
          entityId: result.artcraftId,
          entityType: "Artcraft",
          amount: formData.get("paymentAmount")
        }))
        
        // Update UI to show we're in payment mode
        document.querySelector(".section-title h2").textContent = "Complete Payment"
        document.querySelector(".section-title p").textContent = "Finalize your artcraft listing by completing the payment"
      }
    } else {
      showNotification(result.message || "Failed to add artcraft product", "error")
    }
  } catch (error) {
    console.error("Error adding artcraft product:", error)
    showNotification("An error occurred. Please try again.", "error")
  } finally {
    // Reset button state
    submitBtn.textContent = originalBtnText
    submitBtn.disabled = false
  }
}

// Handle guide form submission
async function handleGuideFormSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  
  // Log the form data for debugging
  console.log("Guide form data being submitted:", Object.fromEntries(formData))

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalBtnText = submitBtn.textContent
  submitBtn.textContent = "Saving..."
  submitBtn.disabled = true

  try {
    const response = await fetch("/api/guides", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (response.ok) {
      showNotification("Guide added successfully!", "success")
      form.reset()
      
      // If payment is needed, show payment section instead of redirecting
      if (result.requiresPayment) {
        // Hide all sections
        document.querySelectorAll(".content-section").forEach((section) => {
          section.classList.remove("active")
        })
        
        // Show payment section
        const paymentSection = document.getElementById("payment")
        paymentSection.classList.add("active")
        
        // Set the payment amount
        document.getElementById("payment-amount").value = formData.get("paymentAmount")
        
        // Store the entity ID and type for payment processing
        localStorage.setItem("pendingPayment", JSON.stringify({
          entityId: result.guideId,
          entityType: "Guide",
          amount: formData.get("paymentAmount")
        }))
        
        // Update UI to show we're in payment mode
        document.querySelector(".section-title h2").textContent = "Complete Payment"
        document.querySelector(".section-title p").textContent = "Finalize your guide listing by completing the payment"
      }
    } else {
      showNotification(result.message || "Failed to add guide", "error")
    }
  } catch (error) {
    console.error("Error adding guide:", error)
    showNotification("An error occurred. Please try again.", "error")
  } finally {
    // Reset button state
    submitBtn.textContent = originalBtnText
    submitBtn.disabled = false
  }
}

// Handle event form submission
async function handleEventFormSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  
  // Log the form data for debugging
  console.log("Event form data being submitted:", Object.fromEntries(formData))

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalBtnText = submitBtn.textContent
  submitBtn.textContent = "Saving..."
  submitBtn.disabled = true

  try {
    const response = await fetch("/api/events", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (response.ok) {
      showNotification("Event added successfully!", "success")
      form.reset()
      
      // If payment is needed, show payment section instead of redirecting
      if (result.requiresPayment) {
        // Hide all sections
        document.querySelectorAll(".content-section").forEach((section) => {
          section.classList.remove("active")
        })
        
        // Show payment section
        const paymentSection = document.getElementById("payment")
        paymentSection.classList.add("active")
        
        // Set the payment amount
        document.getElementById("payment-amount").value = formData.get("paymentAmount")
        
        // Store the entity ID and type for payment processing
        localStorage.setItem("pendingPayment", JSON.stringify({
          entityId: result.eventId,
          entityType: "Event",
          amount: formData.get("paymentAmount")
        }))
        
        // Update UI to show we're in payment mode
        document.querySelector(".section-title h2").textContent = "Complete Payment"
        document.querySelector(".section-title p").textContent = "Finalize your event listing by completing the payment"
      }
    } else {
      showNotification(result.message || "Failed to add event", "error")
    }
  } catch (error) {
    console.error("Error adding event:", error)
    showNotification("An error occurred. Please try again.", "error")
  } finally {
    // Reset button state
    submitBtn.textContent = originalBtnText
    submitBtn.disabled = false
  }
}

// Handle ad form submission
async function handleAdFormSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  
  // Log the form data for debugging
  console.log("Ad form data being submitted:", Object.fromEntries(formData))

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalBtnText = submitBtn.textContent
  submitBtn.textContent = "Saving..."
  submitBtn.disabled = true

  try {
    const response = await fetch("/api/ads", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (response.ok) {
      showNotification("Advertisement added successfully!", "success")
      form.reset()
      
      // If payment is needed, show payment section instead of redirecting
      if (result.requiresPayment) {
        // Hide all sections
        document.querySelectorAll(".content-section").forEach((section) => {
          section.classList.remove("active")
        })
        
        // Show payment section
        const paymentSection = document.getElementById("payment")
        paymentSection.classList.add("active")
        
        // Set the payment amount
        document.getElementById("payment-amount").value = formData.get("paymentAmount")
        
        // Store the entity ID and type for payment processing
        localStorage.setItem("pendingPayment", JSON.stringify({
          entityId: result.adId,
          entityType: "Ad",
          amount: formData.get("paymentAmount")
        }))
        
        // Update UI to show we're in payment mode
        document.querySelector(".section-title h2").textContent = "Complete Payment"
        document.querySelector(".section-title p").textContent = "Finalize your advertisement by completing the payment"
      }
    } else {
      showNotification(result.message || "Failed to add advertisement", "error")
    }
  } catch (error) {
    console.error("Error adding advertisement:", error)
    showNotification("An error occurred. Please try again.", "error")
  } finally {
    // Reset button state
    submitBtn.textContent = originalBtnText
    submitBtn.disabled = false
  }
}

// Handle activity form submission
async function handleActivityFormSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  
  // Log the form data for debugging
  console.log("Activity form data being submitted:", Object.fromEntries(formData))

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalBtnText = submitBtn.textContent
  submitBtn.textContent = "Saving..."
  submitBtn.disabled = true

  try {
    const response = await fetch("/api/activities", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (response.ok) {
      showNotification("Activity added successfully!", "success")
      form.reset()
      
      // Reset the image preview
      document.getElementById('activity-preview').style.display = 'none'
      
      // If payment is needed, show payment section instead of redirecting
      if (result.requiresPayment) {
        // Hide all sections
        document.querySelectorAll(".content-section").forEach((section) => {
          section.classList.remove("active")
        })
        
        // Show payment section
        const paymentSection = document.getElementById("payment")
        paymentSection.classList.add("active")
        
        // Set the payment amount
        document.getElementById("payment-amount").value = formData.get("paymentAmount")
        
        // Store the entity ID and type for payment processing
        localStorage.setItem("pendingPayment", JSON.stringify({
          entityId: result.activityId,
          entityType: "Activity",
          amount: formData.get("paymentAmount")
        }))
        
        // Update UI to show we're in payment mode
        document.querySelector(".section-title h2").textContent = "Complete Payment"
        document.querySelector(".section-title p").textContent = "Finalize your activity listing by completing the payment"
      }
    } else {
      showNotification(result.message || "Failed to add activity", "error")
    }
  } catch (error) {
    console.error("Error adding activity:", error)
    showNotification("An error occurred. Please try again.", "error")
  } finally {
    // Reset button state
    submitBtn.textContent = originalBtnText
    submitBtn.disabled = false
  }
}

// Show notification
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  document.body.appendChild(notification)

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.classList.add("fade-out")
    setTimeout(() => {
      notification.remove()
    }, 500)
  }, 3000)
}

// Handle file input preview
function previewImage(input, previewId) {
  const preview = document.getElementById(previewId)
  const file = input.files[0]

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.src = e.target.result
      preview.style.display = "block"
    }
    reader.readAsDataURL(file)
  }
}

// Payment simulation
function simulatePayment() {
  const amount = document.getElementById("payment-amount").value
  const upiId = document.getElementById("payment-upi").value
  
  if (!amount || isNaN(amount) || amount <= 0) {
    showNotification("Please enter a valid amount", "error")
    return
  }
  
  if (!upiId) {
    showNotification("Please enter your UPI ID", "error")
    return
  }

  // Simulate payment processing
  document.getElementById("payment-status").textContent = "Processing..."

  // Get the entity info from local storage
  const pendingPayment = JSON.parse(localStorage.getItem("pendingPayment") || "{}")
  const { entityId, entityType } = pendingPayment

  if (!entityId || !entityType) {
    showNotification("Payment information is missing. Please try again.", "error")
    return
  }

  setTimeout(() => {
    document.getElementById("payment-status").textContent = "Payment successful!"
    
    // Submit payment data to server
    fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number.parseFloat(amount),
        status: "completed",
        entityId: entityId,
        entityType: entityType,
        upiId: upiId,
        timestamp: new Date().toISOString(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        showNotification("Payment recorded successfully!", "success")
        
        // Reset form and redirect to home after successful payment
        document.getElementById("payment-form").reset()
        
        // Clear the stored entity info
        localStorage.removeItem("pendingPayment")
        
        // After 2 seconds, redirect to home page
        setTimeout(() => {
          // Show home section
          document.querySelectorAll(".content-section").forEach((section) => {
            section.classList.remove("active")
          })
          document.getElementById("home").classList.add("active")
          
          // Update active nav link
          document.querySelectorAll("nav a").forEach((link) => link.classList.remove("active"))
          document.querySelector('nav a[data-target="home"]').classList.add("active")
        }, 2000)
      })
      .catch((error) => {
        console.error("Error recording payment:", error)
        showNotification("Error recording payment. Please try again.", "error")
      })
  }, 2000)
}