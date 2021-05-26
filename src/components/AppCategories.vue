<template>
  <div class="categories-list">
    <ck-category
      v-for="(income, i) of incomes"
      :key="`inc-${i}`"
      :icon="income.icon"
      :title="income.title"
      type="income"
    />
  </div>
  <div class="categories-list">
    <ck-category
      v-for="(account, i) of accounts"
      :key="`acc-${i}`"
      :icon="account.icon"
      :title="account.title"
      type="account"
    />
  </div>
  <div class="categories-list">
    <ck-category
      v-for="(expense, i) of expenses"
      :key="`exp-${i}`"
      :icon="expense.icon"
      :title="expense.title"
      type="expense"
    />
  </div>

  <div class="dropzones">
    <div class="dropzone">
      <div>Dropzone 1</div>
    </div>
    <div class="dropzone">
      <div>Dropzone 2</div>
    </div>
  </div>
</template>

<script>
import CkCategory from './CkCategory.vue'

export default {
  name: 'AppCategories',
  components: {CkCategory},
  props: {
    incomes: {type: Array, required: true},
    accounts: {type: Array, required: true},
    expenses: {type: Array, required: true},
  },
  mounted () {
    let dragged
    document.addEventListener('drag', e => {})
    document.addEventListener('dragstart', e => {
      dragged = e.target.closest('.ck-category')
      dragged.style.opacity = 0.5
    })
    document.addEventListener('dragend', e => {
      dragged.style.opacity = ''
    })

    // prevent default to allow drop
    document.addEventListener('dragover', e => {
      e.preventDefault()
    })
    document.addEventListener('dragenter', e => {
      let dz = e.target.closest('.dropzone')
      if (dz) {
        dz.classList.add('dragover')
      }
    })
    document.addEventListener('dragleave', e => {
      let dz = e.target.closest('.dropzone')
      if (dz) {
        dz.classList.remove('dragover')
      }
    })
    document.addEventListener('drop', e => {
      e.preventDefault()
      let dz = e.target.closest('.dropzone')
      if (dz) {
        dz.classList.remove('dragover')
        dragged.parentNode.removeChild(dragged)
        dz.appendChild(dragged)
      }
    })
  },
}
</script>

<style>
  .categories-list {
    display: flex;
  }
  .dropzones {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, 400px);
  }
  .dropzone {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid red;
    min-height: 10rem;
    min-width: 10rem;
  }
  .dragover {
    background-color: lightsteelblue;
  }
</style>
