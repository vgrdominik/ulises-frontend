<template>
  <v-dialog v-if="type === 'default'" v-on="$listeners" v-bind="$attrs">
    <v-card :shaped="! withoutShaped">
      <v-toolbar flat color="primary">
        <slot name="leftTitleContent" />

        <v-spacer />
        <slot name="centerTitleContent">
          <v-toolbar-title style="color: white;" v-html="title" />
        </slot>
        <v-spacer />

        <slot name="rightTitleContent" />
      </v-toolbar>
      <slot v-if="fluid" />
      <v-container v-else>
        <slot />
      </v-container>
    </v-card>
  </v-dialog>
  <v-dialog v-else v-on="$listeners" v-bind="$attrs">
    <v-card>
      <slot />
    </v-card>
  </v-dialog>
</template>

<script type="application/javascript">
export default {
  name: "CtDialog",

  props: {
    'type': {
      type: String,
      default: 'default',
      validator: function (value) {
        // The value must match one of these strings
        return ['default', 'empty'].indexOf(value) !== -1
      }
    },
    'title': {
      type: String,
      default: '',
    },
    'withoutShaped': {
      type: Boolean,
      default: false,
    },
    'fluid': {
      type: Boolean,
      default: false,
    },
  },
}
</script>
