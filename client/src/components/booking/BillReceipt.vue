<script setup>
import { computed } from 'vue'

const props = defineProps({
  booking: {
    type: Object,
    required: true
  },
  room: {
    type: Object,
    required: true
  }
})

const nights = computed(() => {
  const inDate = new Date(props.booking.checkIn)
  const outDate = new Date(props.booking.checkOut)
  const diff = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 1
})

const totalAmount = computed(() => nights.value * props.room.price)

const bookingRef = computed(() => {
  const id = props.booking._id || props.booking.id || ''
  return `BK-${String(id).slice(-6).toUpperCase()}`
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="bill-receipt card">
    <div class="receipt-header">
      <h3>Booking Receipt</h3>
      <span class="ref-number">{{ bookingRef }}</span>
    </div>

    <div class="receipt-row">
      <span>Status</span>
      <span class="badge" :class="`status-${booking.status}`">{{ booking.status }}</span>
    </div>

    <div class="receipt-row">
      <span>Room</span>
      <strong>{{ room.name }}</strong>
    </div>
    <div class="receipt-row">
      <span>Check-in</span>
      <strong>{{ formatDate(booking.checkIn) }}</strong>
    </div>
    <div class="receipt-row">
      <span>Check-out</span>
      <strong>{{ formatDate(booking.checkOut) }}</strong>
    </div>
    <div class="receipt-row">
      <span>{{ nights }} night(s) &times; Rs. {{ room.price.toLocaleString() }}</span>
      <strong>Rs. {{ totalAmount.toLocaleString() }}</strong>
    </div>

    <div class="receipt-total">
      <span>Total Amount</span>
      <span class="total-amount">Rs. {{ totalAmount.toLocaleString() }}</span>
    </div>

    <div class="payment-note">
      <span class="payment-icon">&#128181;</span>
      <span>Payment: <strong>Pay at Hotel</strong> during check-in</span>
    </div>
  </div>
</template>

<style scoped>
.bill-receipt {
  padding: 1.5rem;
}

.receipt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed var(--color-border);
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
}

.receipt-header h3 {
  margin: 0;
  font-size: 1.05rem;
}

.ref-number {
  font-size: 0.8rem;
  font-family: 'Courier New', monospace;
  color: var(--color-text-muted);
  background: var(--color-bg);
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  padding: 0.35rem 0;
  color: var(--color-text-muted);
}

.receipt-row strong {
  color: var(--color-text);
}

.receipt-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed var(--color-border);
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  font-weight: 700;
}

.total-amount {
  font-size: 1.25rem;
  color: var(--color-primary);
}

.payment-note {
  margin-top: 1rem;
  background: #fff6e0;
  color: #92700c;
  padding: 0.6rem 0.9rem;
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.payment-icon {
  font-size: 1rem;
}

.status-confirmed {
  background: #e6f4ea;
  color: var(--color-success);
}

.status-pending {
  background: #fff6e0;
  color: #92700c;
}

.status-cancelled {
  background: #fdecec;
  color: var(--color-danger);
}
</style>
