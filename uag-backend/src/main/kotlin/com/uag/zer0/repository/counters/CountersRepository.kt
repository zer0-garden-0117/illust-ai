package com.uag.zer0.repository.counters

import com.uag.zer0.entity.counters.Counters
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository

@EnableScan
interface CountersRepository : CrudRepository<Counters, String>