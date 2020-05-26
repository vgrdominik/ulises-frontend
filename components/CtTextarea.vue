<template>
  <v-textarea v-if="ctType==='outlined'" :dense="! withoutDense" outlined v-on="$listeners" v-bind="$attrs">
    <slot />
  </v-textarea>
  <v-textarea v-else v-on="$listeners" v-bind="$attrs">
    <slot />
  </v-textarea>
</template>

<script type="application/javascript">
export default {
  name: "CtTextarea",

  props: {
    'ctType': {
      type: String,
      default: 'outlined',
      validator: function (value) {
        // The value must match one of these strings
        return ['outlined', 'empty'].indexOf(value) !== -1
      }
    },
    'withoutDense': {
      type: Boolean,
      default: false,
    },
  },
}
</script>
