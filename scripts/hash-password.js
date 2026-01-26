const bcrypt = require('bcryptjs');

const senha = process.argv[2];

if (!senha) {
  console.log('❌ Uso: node scripts/hash-password.js <sua-senha>');
  console.log('');
  console.log('Exemplo: node scripts/hash-password.js minhasenha123');
  process.exit(1);
}

const hash = bcrypt.hashSync(senha, 10);

console.log('');
console.log('✅ Hash gerado com sucesso!');
console.log('');
console.log('📋 Use este hash no banco de dados:');
console.log('');
console.log(hash);
console.log('');
console.log('💡 Comando SQL para criar usuário:');
console.log('');
console.log(`INSERT INTO User (id, email, password, name, createdAt, updatedAt)`);
console.log(`VALUES (UUID(), 'admin@conjuntoguedes.com', '${hash}', 'Administrador', NOW(), NOW());`);
console.log('');
