<template>
  <section>
    <VeeForm
      :validation-schema="useGlobalSchema()"
      class="form"
      @submit="handleSubmit"
      v-slot="{ meta }"
    >
      <div class="inputs">
        <FormCustomField
          name="name"
          as="input"
          type="text"
          placeholder="Enter Your name"
        />
        <FormCustomField
          name="country"
          as="select"
          placeholder="Select Country"
          :options="[
            { label: 'Egypt', value: 'eg' },
            { label: 'Saudi Arabia', value: 'sa' },
            { label: 'UAE', value: 'ae' },
          ]"
        />
      </div>
      <FormCustomField
        name="countries"
        as="multiselect"
        placeholder="Select Countries"
        :options="[
          { label: 'Egypt', value: 'eg' },
          { label: 'Saudi Arabia', value: 'sa' },
          { label: 'UAE', value: 'ae' },
        ]"
      />

      <FormCustomField name="promotion" type="date" placeholder="Select Date" />

      <FormCustomField
        name="holidays"
        type="date"
        selectionMode="range"
        placeholder="Select Dates"
      />

      <FormCustomField
        name="message"
        as="textarea"
        placeholder="Write your message here..."
      />
      <!-- { disabled: !meta.valid } -->
      <button type="submit" class="main-btn">Submit Form</button>
    </VeeForm>
    <!-- <h1>{{$t('title')}} => Products</h1> -->
    <div v-if="getResult">
      <div v-for="(item, index) in getResult?.products" :key="item.id">
        {{ index + 1 }} - {{ item?.title }}
      </div>
    </div>
    <MainButton label="about Page" class="!w-[150px] !m-0" path="/about" />
  </section>
</template>

<script setup>
  const handleSubmit = (values) => {
    console.log(values);
  };

  const { getMethod, getResult } = useApiMethods();

  onMounted(async () => {
    // {limit : 8}
    await getMethod("https://dummyjson.com/products", null, false, true);
  });
</script>
