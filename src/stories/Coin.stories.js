import Coin from '@/components/Coin.vue'
import '@/css/main.css'
import '@/css/ck.css'

export default {
  title: 'Coin',
  component: Coin,
  argTypes: {
    coin: {
      currency: {
        control: {type: 'select'},
        options: ['RUB', 'EUR', 'USD'],
        // options: ['expense', 'income', 'account'],
      },
    }
  },
}

const Template = args => ({
  components: {Coin},
  setup () {
    return {args}
  },
  template: '<Coin v-bind="args" />',
})

export const Fuel = Template.bind({})
Fuel.args = {
  coin: {
    type: 'expense',
    title: 'Авто',
    budget: 0,
    total: 266037,
    icon: 'Fuel',
    currency: 'RUB',
    id: 'avto',
  }
}
