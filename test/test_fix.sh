#!/bin/bash

echo "🧪 測試 /api/auth/login 修復"
echo "======================================"

# 測試 1: 缺少密碼字段（應返回 400）
echo ""
echo "✅ 測試 1：缺少密碼字段"
echo "   期望：400（驗證錯誤）"
response=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{}')
http_code=$(echo "$response" | tail -1)
body=$(echo "$response" | sed '$d')
echo "   實際：$http_code"
if [ "$http_code" == "400" ]; then
  echo "   結果：✅ PASS"
else
  echo "   結果：❌ FAIL (返回 $http_code 而不是 400)"
fi
echo "   響應：${body:0:150}"

# 測試 2: 正確密碼（應返回 200）
echo ""
echo "✅ 測試 2：正確密碼"
echo "   期望：200（成功）"
response=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"5430"}')
http_code=$(echo "$response" | tail -1)
body=$(echo "$response" | sed '$d')
echo "   實際：$http_code"
if [ "$http_code" == "200" ]; then
  echo "   結果：✅ PASS"
else
  echo "   結果：❌ FAIL (返回 $http_code 而不是 200)"
fi
echo "   響應：$body"

# 測試 3: 錯誤密碼（應返回 401）
echo ""
echo "✅ 測試 3：錯誤密碼"
echo "   期望：401（認證失敗）"
response=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"wrong"}')
http_code=$(echo "$response" | tail -1)
body=$(echo "$response" | sed '$d')
echo "   實際：$http_code"
if [ "$http_code" == "401" ]; then
  echo "   結果：✅ PASS"
else
  echo "   結果：❌ FAIL (返回 $http_code 而不是 401)"
fi
echo "   響應：$body"

echo ""
echo "======================================"
echo "✅ 測試完成"
