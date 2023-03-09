using Defi.Direct.Coreservices.Configuration;
using Defi.Direct.Services;
using Defi.Direct.Services.Interfaces;
using System;
using System.Linq;
using System.Collections.Generic;
using Xunit;

namespace Defi.Direct.Api.unit.tests
{
    public class UnitTest1
    {
        [Fact]
        public  void TestEncryption()
        {
            //"salt=2A048D09DC36DBFE" 
            //"key=75739190F13529B4B5EA20FD903CAC85F5E123CD385598829EA6A30B52BF5BBF",
            //"iv" "=063556E066749C2EF9351F0DD7DB8E8B"
            // These are Hex numbers in string format!
            var keys = @"salt=0A0A8F4F71A62FEF
key=9482CDED5B2346300DE4D98C5BB5F8B659092730B74B5A64EF4DEDEC6948C078
iv =00A65D17C3A02D305A5CEA4277FD5D99";
            var lines = keys.Split(Environment.NewLine);
            Dictionary<string, string> keySet = new Dictionary<string, string>();
            foreach (string line in lines)
            {
                var keyVal = line.Split('=');
                keySet.Add(keyVal[0].Trim(), keyVal[1].Trim());
            }
            
            var iv = keySet["iv"];
            var key = keySet["key"];
            IEncryptionService encrypt = new AESEncryptionService(new AESEncryptionOptions() { iv = iv, key = key });
            string test = "testtesttesttesttesttesttesttesttesttesttest";
            string enc = encrypt.Encrypt(test);
            string output = encrypt.Decrypt(enc);
            Assert.Equal(test, output);

        }

        [Fact]
        public  void stringReplaceGuid()
        {
            Dictionary<Guid, Guid> guidUpdatesForSite = new Dictionary<Guid, Guid>();
            Guid old = new Guid("fe513def-6ae1-4516-bacc-418c8283ed63");
            Guid newg = new Guid("327f5dd3-09b4-4f82-88d5-21bc4daf87a7");
            guidUpdatesForSite.Add(old, newg);
            string Options = @"{   ""isActive"": true,   ""readonly"": false,   ""title"": ""State CB"",   ""id"": ""StateCB"",   ""inputType"": ""Dropdown"",   ""fieldListId"": ""fe513def-6ae1-4516-bacc-418c8283ed63"",   ""dataType"": ""string"" }";
            foreach (Guid key in guidUpdatesForSite.Keys)
            {
                Guid value = guidUpdatesForSite[key];
                string keyUpper = key.ToString().ToUpper();
                string keyLower = key.ToString().ToLower();
                string valueLower = guidUpdatesForSite[key].ToString().ToLower();
                Options = Options.Replace(keyUpper, valueLower);
                Options = Options.Replace(keyLower, valueLower);
            }
            string ExpectedOptions = @"{   ""isActive"": true,   ""readonly"": false,   ""title"": ""State CB"",   ""id"": ""StateCB"",   ""inputType"": ""Dropdown"",   ""fieldListId"": ""327f5dd3-09b4-4f82-88d5-21bc4daf87a7"",   ""dataType"": ""string"" }";
            Assert.Equal(ExpectedOptions, Options);
        }

        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }

        public static string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }

        public static byte[] StringToByteArray(string hex)
        {
            return Enumerable.Range(0, hex.Length)
                             .Where(x => x % 2 == 0)
                             .Select(x => Convert.ToByte(hex.Substring(x, 2), 16))
                             .ToArray();
        }
    }
}
