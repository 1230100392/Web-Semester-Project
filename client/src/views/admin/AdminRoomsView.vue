<script setup>
import { ref, onMounted, reactive } from 'vue'
import { fetchRooms, createRoom, updateRoom, deleteRoom } from '../../api/rooms'
import BaseAlert from '../../components/common/BaseAlert.vue'

const rooms = ref([])
const loading = ref(true)
const error = ref('')
const successMsg = ref('')

const showForm = ref(false)
const editingId = ref(null)

const emptyForm = {
  name: '',
  type: 'Standard',
  price: 0,
  totalUnits: 5,
  capacity: 1,
  rating: 4.5,
  image: '',
  amenitiesText: '',
  description: ''
}
const form = reactive({ ...emptyForm })

async function loadRooms() {
  loading.value = true
  try {
    rooms.value = await fetchRooms()
  } catch (err) {
    error.value = 'Failed to load rooms.'
  } finally {
    loading.value = false
  }
}

onMounted(loadRooms)

function openCreateForm() {
  Object.assign(form, emptyForm)
  editingId.value = null
  showForm.value = true
}

function openEditForm(room) {
  Object.assign(form, {
    name: room.name,
    type: room.type,
    price: room.price,
    totalUnits: room.totalUnits,
    capacity: room.capacity,
    rating: room.rating,
    image: room.image,
    amenitiesText: (room.amenities || []).join(', '),
    description: room.description
  })
  editingId.value = room.id
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

async function handleSubmit() {
  error.value = ''
  successMsg.value = ''

  const payload = {
    name: form.name,
    type: form.type,
    price: Number(form.price),
    totalUnits: Number(form.totalUnits),
    capacity: Number(form.capacity),
    rating: Number(form.rating),
    image: form.image,
    description: form.description,
    amenities: form.amenitiesText
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean)
  }

  try {
    if (editingId.value) {
      await updateRoom(editingId.value, payload)
      successMsg.value = 'Room updated successfully.'
    } else {
      await createRoom(payload)
      successMsg.value = 'Room created successfully.'
    }
    showForm.value = false
    await loadRooms()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save room.'
  }
}

async function handleDelete(room) {
  if (!confirm(`Delete "${room.name}"? This cannot be undone.`)) return
  try {
    await deleteRoom(room.id)
    successMsg.value = 'Room deleted.'
    await loadRooms()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to delete room.'
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1>Rooms</h1>
        <p class="text-muted">Manage room listings shown to guests.</p>
      </div>
      <button class="btn btn-primary" @click="openCreateForm">+ Add Room</button>
    </div>

    <BaseAlert v-if="successMsg" type="success" :message="successMsg" />
    <BaseAlert v-if="error" type="error" :message="error" />

    <!-- Create / Edit Form -->
    <div v-if="showForm" class="card form-card">
      <h3>{{ editingId ? 'Edit Room' : 'Add New Room' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label>Name</label>
            <input v-model="form.name" type="text" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Type</label>
            <select v-model="form.type" class="form-control">
              <option>Standard</option>
              <option>Deluxe</option>
              <option>Suite</option>
              <option>Family</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Price (Rs. / night)</label>
            <input v-model="form.price" type="number" min="0" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Total Units (rooms of this type)</label>
            <input v-model="form.totalUnits" type="number" min="0" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Capacity (guests)</label>
            <input v-model="form.capacity" type="number" min="1" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Rating</label>
            <input v-model="form.rating" type="number" min="0" max="5" step="0.1" class="form-control" />
          </div>
        </div>

        <div class="form-group">
          <label>Image URL</label>
          <input v-model="form.image" type="url" class="form-control" placeholder="https://..." required />
        </div>

        <div class="form-group">
          <label>Amenities (comma-separated)</label>
          <input
            v-model="form.amenitiesText"
            type="text"
            class="form-control"
            placeholder="Free Wi-Fi, Air Conditioning, Breakfast Included"
          />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea v-model="form.description" class="form-control" rows="3" required></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            {{ editingId ? 'Save Changes' : 'Create Room' }}
          </button>
          <button type="button" class="btn btn-outline" @click="closeForm">Cancel</button>
        </div>
      </form>
    </div>

    <!-- Rooms Table -->
    <p v-if="loading" class="text-muted">Loading rooms...</p>
    <div v-else class="card table-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Price</th>
            <th>Units</th>
            <th>Available</th>
            <th>Capacity</th>
            <th>Rating</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.id">
            <td>{{ room.name }}</td>
            <td>{{ room.type }}</td>
            <td>Rs. {{ room.price.toLocaleString() }}</td>
            <td>{{ room.totalUnits }}</td>
            <td :class="{ 'sold-out-cell': room.availableUnits === 0 }">{{ room.availableUnits }}</td>
            <td>{{ room.capacity }}</td>
            <td>&#9733; {{ room.rating }}</td>
            <td class="actions-cell">
              <button class="btn btn-outline btn-sm" @click="openEditForm(room)">Edit</button>
              <button class="btn btn-sm delete-btn" @click="handleDelete(room)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="rooms.length === 0" class="text-muted empty-msg">No rooms yet. Add one above.</p>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-card {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.table-card {
  padding: 0;
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.admin-table th {
  text-align: left;
  color: var(--color-text-muted);
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.8rem;
  text-transform: uppercase;
  white-space: nowrap;
}

.admin-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.35rem 0.85rem;
  font-size: 0.8rem;
}

.delete-btn {
  background: #fdecec;
  color: var(--color-danger);
}

.delete-btn:hover {
  background: #f8d7d7;
}

.empty-msg {
  padding: 1.5rem;
  text-align: center;
}

.sold-out-cell {
  color: var(--color-danger);
  font-weight: 700;
}
</style>
