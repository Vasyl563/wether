<template>
  <div class="gap-[20px] flex justify-between !w-[700px]">
    <div class="flex items-center gap-[20px]">
      <p class="whitespace-nowrap">Chose a day</p>
      <el-date-picker
          v-model="datePicker"
          type="date"
          placeholder="Pick a day"
          size="large"
      />
    </div>
    <el-input v-model="input" placeholder="Please select city"/>
    <button class="border cursor-pointer hover:bg-gray-700 hover:text-white px-[25px] rounded-md"
            @click="searchCity(input)">Search
    </button>
  </div>
  <el-table v-if="filteredTableData"
            v-loading="loading"
            :default-sort="tableConfig"
            :data="filteredTableData"
            empty-text=" "
            class="w-[700px]"
            :key="datePicker"
  >
    <el-table-column v-for="col in tableConfig"
                     :key="col.prop"
                     sortable
                     :prop="col.prop"
                     :label="capitalizeFirstLetter(col.prop)"
    />
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search"/>
      </template>
      <template #default="scope">
        <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
        >Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-empty v-else description="No data"/>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {notification} from '@/helpers/notification.js'
import {capitalizeFirstLetter} from '@/helpers/capitalizeFirstLetter.js'
import dayjs from 'dayjs'
import {defaultCities} from '@/constants/index.js'
import {getCityWeather} from "../helpers/fetchCityWeather.js";

const loading = ref(false)
//table
const tableData = ref([])
const filteredTableData = ref([])

//search
const datePicker = ref('')
const input = ref('')
const search = ref('')

const tableConfig = [
  {prop: 'city', order: 'descending'},
  {prop: 'maxTemp', order: 'descending'},
  {prop: 'minTemp', order: 'descending'}
]

const searchCity = async (city = input.value, day = dayjs().format('YYYY-MM-DD')) => {
  if (!city) return
  city = city.trim().toLowerCase()
  day = dayjs(day).format('YYYY-MM-DD')
  try {
    loading.value = true
    const result = await getCityWeather(city, day);

    const isDuplicate = tableData.value.some(element => element.city.toLowerCase() === result.city.toLowerCase());

    if (isDuplicate) return notification(`${result.city} is already added!`, 'Error');

    tableData.value.push(result)
    filteredTableData.value = tableData.value
  } catch (e) {
    notification('Invalid city name <br /> ' + e);
  } finally {
    loading.value = false
    input.value = ''
  }
}

const handleDelete = (index, row) => {
  filteredTableData.value = filteredTableData.value.filter((el) => el.city !== row.city)
}

watch(() => search.value, () => {
  filteredTableData.value = tableData.value.filter((data) => !search.value || data.city.toLowerCase().includes(search.value.toLowerCase()))
})


watch(() => datePicker.value, () => {
  filteredTableData.value.map(async (el) => {
    tableData.value = []
    await searchCity(el?.city, datePicker.value)
  })
})

onMounted(() => {
  defaultCities.map(async (el) => {
    await searchCity(el)
  })
})
</script>
