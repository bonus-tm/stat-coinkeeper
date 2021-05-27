<template>
  <div class="categories-list">
    <ck-category
      v-for="(income, i) of incomes"
      :key="`inc-${i}`"
      :category="income"
      type="income"
    />
  </div>
  <div class="categories-list">
    <ck-category
      v-for="(account, i) of accounts"
      :key="`acc-${i}`"
      :category="account"
      type="account"
    />
  </div>
  <div class="categories-list">
    <ck-category
      v-for="(expense, i) of expenses"
      :key="`exp-${i}`"
      :category="expense"
      type="expense"
    />
  </div>

  <div class="dropzones">
    <div v-for="(section, index) of money" :key="index">
      <h3>{{ section.title }}: {{ Math.round(moneyValues[index]) }}</h3>
      <div class="dropzone">
        <div
          v-show="dragging"
          class="dz-cover"
          :class="{dragover: section.dragover}"
          @dragenter="onDragEnter(index)"
          @dragleave="onDragLeave(index)"
          @dragover="$event.preventDefault()"
          @drop="onDrop(index, $event)"
        />
        <ck-category
          v-for="(account, i) of section.categories"
          :key="`money-acc-${i}`"
          :category="account"
          type="account"
          @click="remove(index, account.id)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {state} from '../services/store'
import CkCategory from './CkCategory.vue'

export default {
  name: 'AppCategories',
  components: {CkCategory},
  props: {
    incomes: {type: Array, required: true},
    accounts: {type: Array, required: true},
    expenses: {type: Array, required: true},
  },
  data () {
    return {
      currencyRates: {
        RUB: 1,
        USD: 73.41,
        EUR: 89.52,
      },
      money: {
        cashless: {title: 'Безнал', value: 0, dragover: false, categories: []},
        cash: {title: 'Наличка', value: 0, dragover: false, categories: []},
        currency: {title: 'Валюта', value: 0, dragover: false, categories: []},
        gulden: {title: 'Клад', value: 0, dragover: false, categories: []},
        rest: {title: 'Остальное', value: 0, dragover: false, categories: []},
      }
    }
  },
  computed: {
    dragging () {
      return state.dragging
    },
    moneyValues () {
      let values = {}
      for (let key of Object.keys(this.money)) {
        values[key] = this.money[key].categories.reduce((acc, category) => {
          acc += category.value * this.currencyRates[category.currency]
          return acc
        }, 0)
      }
      return values
    },
  },
  methods: {
    onDragEnter (sectionId) {
      this.money[sectionId].dragover = true
    },
    onDragLeave (sectionId) {
      this.money[sectionId].dragover = false
    },
    onDrop (sectionId, e) {
      e.preventDefault()
      console.log('drop')
      this.money[sectionId].dragover = false
      let {type, category} = JSON.parse(e.dataTransfer.getData('text'))
      let droppedBefore = this.money[sectionId].categories
        .find(cat => cat.id === category.id)
      if (type === 'account' && !droppedBefore) {
        this.money[sectionId].categories.push(category)
      }
    },
    remove (sectionId, categoryId) {
      let i = this.money[sectionId].categories.findIndex(cat => cat.id === categoryId)
      if (i !== -1) this.money[sectionId].categories.splice(i, 1)
    },
  }
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
    position: relative;
    display: flex;
    border: 1px solid red;
    border-radius: 3px;
    min-height: 10rem;
    min-width: 10rem;
  }
  .dz-cover {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--dropzone-hover-bg-color);
    opacity: 0.2;
    z-index: 10;
  }
  .dragover {
    background-color: var(--dropzone-hover-bg-color);
    opacity: 0.5;
  }

  h3 {
    text-align: center;
  }
</style>
