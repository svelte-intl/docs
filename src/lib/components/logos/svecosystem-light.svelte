<script lang="ts">
  import type { HTMLImgAttributes } from "svelte/elements";

    type Props = HTMLImgAttributes;

    let { ...rest }: Props = $props();
</script>

<img src="/logo-light.png" alt="svelte-i18n logo" {...rest} />