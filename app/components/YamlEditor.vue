<script setup lang="ts">
import { yaml } from '@codemirror/lang-yaml'
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup, EditorView } from 'codemirror'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref<HTMLElement | null>(null)
let editorView: EditorView | null = null

onMounted(() => {
  if (!editorRef.value)
    return

  editorView = new EditorView({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      yaml(),
      oneDark,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          emit('update:modelValue', update.state.doc.toString())
        }
      }),
    ],
    parent: editorRef.value,
  })
})

onUnmounted(() => {
  editorView?.destroy()
})
</script>

<template>
  <div ref="editorRef" class="border border-[var(--border)] overflow-hidden" />
</template>
