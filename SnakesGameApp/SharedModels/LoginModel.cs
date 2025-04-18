using System.Runtime.Serialization;

namespace SharedModels
{
    [DataContract]
    public class LoginModel
    {
        [DataMember]
        public string Email { get; set; }

        [DataMember]
        public string Password { get; set; }
        [DataMember]
        public string Region { get; set; }
    }
}