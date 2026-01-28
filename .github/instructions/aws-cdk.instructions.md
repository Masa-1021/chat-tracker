---
applyTo: "infra/**/*.ts,cdk/**/*.ts,**/cdk.ts"
---

# AWS CDK コーディングルール

## 構造

- L2/L3 コンストラクトを優先使用（L1 CfnXxx は最終手段）
- スタック分割は責務ごと（API / Database / Monitoring等）
- コンストラクトは再利用可能な単位で設計

```typescript
// ✅ 推奨構造
export class ApiStack extends Stack {
  public readonly api: RestApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);
    // ...
  }
}
```

## 命名規則

- スタック: `{Service}{Environment}Stack`（例: `ApiProductionStack`）
- コンストラクト: PascalCase
- リソースID: 論理的で一意な名前

## 環境設定

- ハードコードされた AWS アカウントID / リージョンは禁止
- 環境変数または cdk.json の context を使用
- ステージング環境と本番環境の設定を分離

```typescript
// ✅ 環境設定の例
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};
```

## セキュリティ

- IAMポリシーは最小権限の原則
- `grant*` メソッドを活用
- シークレットは Secrets Manager または SSM Parameter Store
- 本番環境では `removalPolicy: RemovalPolicy.RETAIN`

## Lambda

- Node.js 22.x ランタイムを使用
- ARM64 アーキテクチャを優先（コスト効率）
- バンドリングは esbuild (NodejsFunction)
- 環境変数で設定を注入

## DynamoDB

- オンデマンドキャパシティモードをデフォルトに
- GSI/LSI は必要最小限
- TTL を活用したデータライフサイクル管理

## テスト

- `assertions` モジュールでインフラテスト
- スナップショットテストで予期しない変更を検出
