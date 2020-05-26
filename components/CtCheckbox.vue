<template>
  <v-checkbox :dense="! withoutDense" v-on="$listeners" v-bind="$attrs">
    <slot />
  </v-checkbox>
</template>

<script type="application/javascript">
export default {
  name: "CtCheckbox",

  props: {
    'withoutDense': {
      type: Boolean,
      default: false,
    },
  },
}
</script>
