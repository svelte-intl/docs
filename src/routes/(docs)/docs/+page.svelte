<script lang="ts">
  import { useI18n } from "$lib/i18n/index.js";
	import { DocPage } from "@svecodocs/kit";
	
    let { data } = $props();
    let { t } = useI18n();
</script>

<DocPage component={data.component} {...data.metadata} />
