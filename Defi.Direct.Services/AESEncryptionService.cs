using Defi.Direct.Coreservices.Configuration;
using Defi.Direct.Services.Interfaces;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Defi.Direct.Services
{
    public class AESEncryptionService : IEncryptionService
    {
        private byte[] iv;
        private byte[] key;
        public AESEncryptionService(IOptions<AESEncryptionOptions> ioptions)
        {
            var options = ioptions.Value;
            iv = HexStringToByteArray(options.iv);
            key = HexStringToByteArray(options.key);
        }

        public AESEncryptionService(AESEncryptionOptions options)
        {
            iv = HexStringToByteArray(options.iv);
            key = HexStringToByteArray(options.key);
        }

        public string Encrypt(string input)
        {
            var buffer = Encoding.UTF8.GetBytes(input);
            using (var aes = Aes.Create())
            {
                aes.KeySize = 256;
                aes.Key = key;
                aes.IV = iv;
                aes.Padding = PaddingMode.Zeros;
                using (var encryptor = aes.CreateEncryptor(aes.Key, aes.IV))
                using (var resultStream = new MemoryStream())
                {
                    using (var aesStream = new CryptoStream(resultStream, encryptor, CryptoStreamMode.Write))
                    using (var plainStream = new MemoryStream(buffer))
                    {
                        plainStream.CopyTo(aesStream);
                    }

                    return Convert.ToBase64String(resultStream.ToArray());
                }
            }
        }

        public string Decrypt(string input)
        {
            var buffer = Convert.FromBase64String(input);
            using (var aes = Aes.Create())
            {
                aes.KeySize = 256;
                aes.Key = key;
                aes.IV = iv;
                aes.Padding = PaddingMode.Zeros;
                using (var decryptor = aes.CreateDecryptor(aes.Key, aes.IV))
                using (var resultStream = new MemoryStream())
                {
                    using (var aesStream = new CryptoStream(resultStream, decryptor, CryptoStreamMode.Write))
                    using (var plainStream = new MemoryStream(buffer))
                    {
                        plainStream.CopyTo(aesStream);
                    }

                    return Encoding.UTF8.GetString(resultStream.ToArray()).Replace("\0", "");
                }
            }
        }

        private static byte[] HexStringToByteArray(string hex)
        {
            return Enumerable.Range(0, hex.Length)
                             .Where(x => x % 2 == 0)
                             .Select(x => Convert.ToByte(hex.Substring(x, 2), 16))
                             .ToArray();
        }
    }
}
