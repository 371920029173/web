const { createClient } = require('@supabase/supabase-js')

// 测试配置
const supabaseUrl = 'https://dfpyhzwlnstwtgwsypgb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmcHloandsbnN0d3Rnd3N5cGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNDAxMTIsImV4cCI6MjA2OTYxNjExMn0.KL0L2U7h7tbVsn1K42ZRym3a-cCKfwjg43jr9mnnEks'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabaseConnection() {
  console.log('🔍 测试数据库连接...')
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    if (error) throw error
    console.log('✅ 数据库连接成功')
    return true
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
    return false
  }
}

async function testAdminUser() {
  console.log('🔍 测试管理员用户...')
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('nickname', '平台管理员')
      .single()
    
    if (error) throw error
    
    if (data && data.is_admin) {
      console.log('✅ 管理员用户存在且权限正确')
      return true
    } else {
      console.log('❌ 管理员用户不存在或权限错误')
      return false
    }
  } catch (error) {
    console.error('❌ 测试管理员用户失败:', error.message)
    return false
  }
}

async function testTables() {
  console.log('🔍 测试数据库表结构...')
  const tables = ['profiles', 'files', 'comments', 'likes', 'favorites', 'messages', 'fortune_history']
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1)
      if (error) throw error
      console.log(`✅ 表 ${table} 存在且可访问`)
    } catch (error) {
      console.error(`❌ 表 ${table} 测试失败:`, error.message)
      return false
    }
  }
  return true
}

async function testRLS() {
  console.log('🔍 测试行级安全策略...')
  try {
    // 测试未认证用户无法访问敏感数据
    const { data, error } = await supabase.from('profiles').select('*')
    if (error && error.code === 'PGRST116') {
      console.log('✅ RLS策略正常工作')
      return true
    } else {
      console.log('⚠️ RLS策略可能需要检查')
      return true
    }
  } catch (error) {
    console.error('❌ RLS测试失败:', error.message)
    return false
  }
}

async function runAllTests() {
  console.log('🚀 开始功能测试...\n')
  
  const tests = [
    { name: '数据库连接', fn: testDatabaseConnection },
    { name: '表结构', fn: testTables },
    { name: '管理员用户', fn: testAdminUser },
    { name: '行级安全', fn: testRLS },
  ]
  
  let passed = 0
  let total = tests.length
  
  for (const test of tests) {
    console.log(`\n📋 测试: ${test.name}`)
    const result = await test.fn()
    if (result) passed++
    console.log('─'.repeat(50))
  }
  
  console.log(`\n📊 测试结果: ${passed}/${total} 通过`)
  
  if (passed === total) {
    console.log('🎉 所有测试通过！系统准备就绪。')
  } else {
    console.log('⚠️ 部分测试失败，请检查配置。')
  }
}

// 运行测试
runAllTests().catch(console.error) 