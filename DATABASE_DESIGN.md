# Email 驗證資料庫設計

## Firestore 集合結構

### 1. verification_codes 集合
用於儲存 email 驗證碼

```javascript
// 文檔 ID: 使用 email 作為文檔 ID
{
  email: "user@example.com",
  code: "123456",
  createdAt: timestamp,
  expiresAt: timestamp,
  verified: false,
  attempts: 0,
  maxAttempts: 3
}
```

### 2. 安全規則 (Firestore Security Rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 驗證碼集合規則
    match /verification_codes/{email} {
      // 只允許系統寫入，用戶無法直接讀取
      allow read, write: if false;
    }
    
    // 用戶集合規則
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. 資料庫操作函數

#### 儲存驗證碼
```javascript
async function saveVerificationCode(email, code) {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5分鐘後過期
  
  await admin.firestore()
    .collection('verification_codes')
    .doc(email)
    .set({
      email: email,
      code: code,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: expiresAt,
      verified: false,
      attempts: 0,
      maxAttempts: 3
    });
}
```

#### 驗證驗證碼
```javascript
async function verifyCode(email, inputCode) {
  const doc = await admin.firestore()
    .collection('verification_codes')
    .doc(email)
    .get();
    
  if (!doc.exists) {
    throw new Error('驗證碼不存在');
  }
  
  const data = doc.data();
  
  // 檢查是否過期
  if (new Date() > data.expiresAt.toDate()) {
    throw new Error('驗證碼已過期');
  }
  
  // 檢查嘗試次數
  if (data.attempts >= data.maxAttempts) {
    throw new Error('驗證失敗次數過多');
  }
  
  // 檢查驗證碼是否正確
  if (data.code !== inputCode) {
    // 增加嘗試次數
    await doc.ref.update({
      attempts: admin.firestore.FieldValue.increment(1)
    });
    throw new Error('驗證碼錯誤');
  }
  
  // 標記為已驗證
  await doc.ref.update({
    verified: true
  });
  
  return true;
}
```

#### 清理過期驗證碼
```javascript
async function cleanupExpiredCodes() {
  const now = new Date();
  const expiredCodes = await admin.firestore()
    .collection('verification_codes')
    .where('expiresAt', '<', now)
    .get();
    
  const batch = admin.firestore().batch();
  expiredCodes.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
}
```

## 索引設計

### 複合索引
```javascript
// 用於查詢過期驗證碼
{
  collectionGroup: "verification_codes",
  fields: [
    { fieldPath: "expiresAt", order: "ASCENDING" }
  ]
}
```

## 安全考量

1. **驗證碼有效期**: 5分鐘
2. **最大嘗試次數**: 3次
3. **同一 email 發送限制**: 1分鐘內只能發送一次
4. **IP 限制**: 同一 IP 1小時內最多發送 10 次
5. **自動清理**: 定期清理過期驗證碼

## 監控指標

1. 驗證碼發送成功率
2. 驗證成功率
3. 過期驗證碼數量
4. 異常發送行為
