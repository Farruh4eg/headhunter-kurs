<script lang="ts">
  import Job from "$lib/components/Job.svelte";
  let {data} = $props()
</script>

<Job
  job={data.job}
  user_id={data.user_id}
/>
