/* Bo luat heuristic cua May soi noi dung / Heuristic rules for the content scanner.
   Moi luat / each rule:
     id     dinh danh duy nhat / unique id
     w      trong so cong vao diem rui ro, tong gioi han o 100 / weight added to the risk score, capped at 100
     label  ten hien thi song ngu / bilingual display name
     why    giai thich song ngu / bilingual explanation
     re     regex, hoac fn(text) => boolean cho luat phuc tap hon
   Cac mau tieng Viet duoc viet ca ban co dau va khong dau.
   Vietnamese patterns are written both with and without diacritics. */

export const RULES = [
  {
    id: "urgency",
    w: 12,
    label: { vi: "Tạo áp lực thời gian", en: "Manufactured time pressure" },
    why: {
      vi: "Nội dung hối thúc bạn hành động ngay. Kẻ lừa đảo cần bạn vội để bạn không kịp kiểm tra.",
      en: "The message pushes you to act now. Scammers need you rushed so you do not stop to check.",
    },
    re: /(khẩn cấp|khan cap|ngay lập tức|ngay lap tuc|trong vòng \d+ ?(giờ|phút|h)|trong vong \d+ ?(gio|phut|h)|hết hạn|het han|sắp hết|sap het|bị khoá|bị khóa|bi khoa|tạm khoá|tạm khóa|tam khoa|đình chỉ|dinh chi|cơ hội cuối|co hoi cuoi|nhanh tay|gấp|hôm nay thôi|chỉ trong hôm nay|urgent(ly)?|immediately|right away|within \d+ ?(hours?|minutes?)|expires?|expiring|deadline|suspended|temporarily locked|last chance|act now|final notice)/gi,
  },
  {
    id: "sensitive",
    w: 22,
    label: { vi: "Hỏi thông tin nhạy cảm", en: "Asks for sensitive credentials" },
    why: {
      vi: "Yêu cầu mật khẩu, OTP, số thẻ hoặc giấy tờ tuỳ thân. Không tổ chức hợp pháp nào hỏi những thứ này qua tin nhắn hay email.",
      en: "It asks for a password, an OTP, a card number or an ID document. No legitimate organisation asks for these over email or chat.",
    },
    re: /(mật khẩu|mat khau|password|otp|mã xác thực|ma xac thuc|mã xác minh|ma xac minh|cccd|cmnd|căn cước|can cuoc|số thẻ|so the|mã pin|ma pin|cvv|ssn|số tài khoản|so tai khoan|ảnh chụp thẻ|anh chup the|verification code|security code|card number|pin code|one[- ]time (code|password)|id card|passport number)/gi,
  },
  {
    id: "credlogin",
    w: 16,
    label: { vi: "Yêu cầu đăng nhập qua link", en: "Login demanded through a link" },
    why: {
      vi: "Bạn được dẫn tới một trang đăng nhập từ trong tin nhắn. Hãy tự mở trang chính thức thay vì bấm link.",
      en: "You are being steered to a login page from inside a message. Open the official site yourself instead of tapping the link.",
    },
    re: /(đăng nhập (lại|ngay|tại)|dang nhap (lai|ngay|tai)|xác minh tài khoản|xac minh tai khoan|verify (your )?account|confirm your (account|identity)|log ?in (here|now)|sign in (here|now)|re-?activate your account)/gi,
  },
  {
    id: "money",
    w: 12,
    label: { vi: "Mồi nhử tiền hoặc quà", en: "Money or prize bait" },
    why: {
      vi: "Hứa hẹn lợi ích lớn và dễ dàng. Đây là mồi nhử để bạn bước vào các bước sau.",
      en: "It promises a large, easy reward. That is the bait that gets you to take the next step.",
    },
    re: /(trúng thưởng|trung thuong|nhận quà|nhan qua|miễn phí 100|học bổng 100|hoàn tiền|hoan tien|việc nhẹ lương cao|viec nhe luong cao|thu nhập \d|thu nhap \d|hoa hồng|hoa hong|chiết khấu|chiet khau|nhiệm vụ|nhiem vu|lợi nhuận|loi nhuan|you (have )?won|congratulations|free gift|claim your (prize|reward)|cash ?back|commission|guaranteed (income|profit)|easy money)/gi,
  },
  {
    id: "fee",
    w: 20,
    label: { vi: "Đòi trả tiền trước", en: "Payment demanded up front" },
    why: {
      vi: "Bạn phải chuyển tiền trước khi nhận được bất cứ thứ gì. Đây là dấu hiệu nặng nhất.",
      en: "You have to send money before you receive anything. This is the heaviest single sign.",
    },
    re: /(phí hồ sơ|phi ho so|đặt cọc|dat coc|chuyển khoản trước|chuyen khoan truoc|phí vận chuyển|phi van chuyen|phí kích hoạt|phi kich hoat|nạp \d|nap \d|thanh toán trước|thanh toan truoc|phí xử lý|phi xu ly|deposit|shipping fee|processing fee|activation fee|administrative fee|pay (in advance|first)|top ?up)/gi,
  },
  {
    id: "shortlink",
    w: 14,
    label: { vi: "Link rút gọn", en: "Shortened link" },
    why: {
      vi: "Link rút gọn che giấu địa chỉ thật, bạn không biết mình sẽ tới đâu trước khi bấm.",
      en: "A shortened link hides the real address, so you cannot tell where it leads before you tap it.",
    },
    re: /(bit\.ly|tinyurl|cutt\.ly|shorturl|is\.gd|rebrand\.ly|t\.co\/|link\.tl)/gi,
  },
  {
    id: "tld",
    w: 18,
    label: { vi: "Tên miền đáng ngờ", en: "Suspicious domain" },
    why: {
      vi: "Đuôi tên miền hiếm gặp hoặc địa chỉ IP thô. Các tổ chức thật hầu như không dùng những đuôi này.",
      en: "An unusual top-level domain or a raw IP address. Real institutions almost never publish links like these.",
    },
    re: /((https?:\/\/)?[a-z0-9.-]+\.(xyz|top|icu|click|live|cc|tk|ml|ga|buzz|rest|cfd|shop|online|site)\b|https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|xn--)/gi,
  },
  {
    id: "lookalike",
    w: 18,
    label: { vi: "Tên miền nhái thương hiệu", en: "Brand look-alike domain" },
    why: {
      vi: "Tên thương hiệu bị ghép thêm chữ hoặc thay chữ bằng số. Thương hiệu thật dùng đúng tên miền gốc của họ.",
      en: "A brand name padded with extra words or with letters swapped for digits. The real brand uses its own bare domain.",
    },
    re: /(faceb00k|g00gle|micr0soft|vietc0mbank|zal0|paypa1|(vietcombank|techcombank|vietinbank|bidv|mbbank|momo|shopee|facebook|google|microsoft|office365|viettel|zalo|tiktok|paypal|netflix)[-_][a-z0-9-]{2,}\.[a-z]{2,})/gi,
  },
  {
    id: "http",
    w: 8,
    label: { vi: "Liên kết không mã hoá", en: "Unencrypted link" },
    why: {
      vi: "Địa chỉ dùng http thay vì https. Trang đăng nhập thật gần như luôn dùng https.",
      en: "The address uses http instead of https. Real login pages are effectively always on https.",
    },
    re: /http:\/\//gi,
  },
  {
    id: "channel",
    w: 10,
    label: { vi: "Kéo sang kênh riêng", en: "Pulls you to a private channel" },
    why: {
      vi: "Bạn được mời chuyển sang Zalo, Telegram hoặc tin nhắn riêng, nơi không ai giám sát và không có lịch sử để tố cáo.",
      en: "You are invited to move to Zalo, Telegram or a private chat, where nobody is watching and no record survives.",
    },
    re: /(kết bạn zalo|ket ban zalo|liên hệ zalo|nhắn tin riêng|nhan tin rieng|inbox riêng|telegram|whatsapp|dm me|message me privately|add me on)/gi,
  },
  {
    id: "secrecy",
    w: 16,
    label: { vi: "Yêu cầu giữ bí mật", en: "Demands secrecy" },
    why: {
      vi: "Bạn được dặn không nói với ai. Mục đích là cắt bạn khỏi người có thể can ngăn.",
      en: "You are told not to tell anyone. The point is to cut you off from anyone who might stop you.",
    },
    re: /(giữ bí mật|giu bi mat|không (được )?nói với ai|khong noi voi ai|đừng nói với|dung noi voi|không thông báo cho|bí mật điều tra|keep (this|it) (a )?secret|do not tell anyone|don't tell anyone|confidential investigation)/gi,
  },
  {
    id: "malware",
    w: 22,
    label: { vi: "File hoặc ứng dụng lạ", en: "Unknown file or app" },
    why: {
      vi: "Yêu cầu tải file cài đặt ngoài kho ứng dụng chính thức. Đây là cách phổ biến để chiếm quyền điện thoại.",
      en: "You are asked to install something from outside the official app stores. This is the standard route to taking over a phone.",
    },
    re: /(\.apk|\.exe|\.scr|\.rar|cài đặt ứng dụng|cai dat ung dung|tải app|tai app|cài app|cai app|tải ứng dụng|tai ung dung|download (the )?app|install (this|our) app|enable unknown sources)/gi,
  },
  {
    id: "authority",
    w: 14,
    label: { vi: "Mạo danh cơ quan chức năng", en: "Impersonates an authority" },
    why: {
      vi: "Nhắc tới công an, toà án hoặc vi phạm pháp luật để gây sợ hãi. Cơ quan chức năng làm việc bằng giấy mời tại trụ sở.",
      en: "It invokes police, courts or criminal charges to frighten you. Real authorities summon you in writing, to an office.",
    },
    re: /(công an|cong an|viện kiểm sát|vien kiem sat|toà án|tòa án|toa an|rửa tiền|rua tien|vi phạm pháp luật|khởi tố|khoi to|lệnh bắt|police|court order|money laundering|arrest warrant|legal action|criminal case)/gi,
  },
  {
    id: "generic",
    w: 6,
    label: { vi: "Lời chào chung chung", en: "Generic greeting" },
    why: {
      vi: "Không gọi đúng tên bạn. Dấu hiệu của thư gửi hàng loạt.",
      en: "It does not use your name. A sign of a message blasted to thousands of people.",
    },
    re: /(kính gửi quý (khách|phụ huynh)|kinh gui quy|quý khách hàng thân mến|dear (valued )?(customer|user|student|client|sir\/madam|account holder))/gi,
  },
  {
    id: "freemail",
    w: 14,
    label: { vi: "Danh nghĩa tổ chức nhưng dùng email cá nhân", en: "Institutional claim from a free mailbox" },
    why: {
      vi: "Nội dung nhân danh một tổ chức nhưng lại gửi từ hộp thư miễn phí. Tổ chức thật dùng tên miền riêng.",
      en: "The message speaks for an institution but comes from a free mailbox. Real institutions send from their own domain.",
    },
    fn: (t) =>
      /(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)/i.test(t) &&
      /(phòng đào tạo|phong dao tao|nhà trường|nha truong|ngân hàng|ngan hang|bộ giáo dục|bo giao duc|ban tổ chức|ban to chuc|công an|trung tâm|university|school|bank|ministry|department|police|committee)/i.test(t),
  },
  {
    id: "shout",
    w: 6,
    label: { vi: "Viết hoa hoặc chấm than quá mức", en: "Shouting caps or exclamation marks" },
    why: {
      vi: "Dùng chữ hoa và dấu chấm than để tạo cảm xúc mạnh, khiến bạn phản ứng thay vì suy nghĩ.",
      en: "Caps and exclamation marks are there to spike emotion so you react instead of thinking.",
    },
    fn: (t) => (t.match(/!{2,}/g) || []).length > 0 || (t.match(/\b[A-ZÀ-Ỹ]{4,}\b/g) || []).length >= 3,
  },
  {
    id: "manylinks",
    w: 6,
    label: { vi: "Nhiều liên kết trong một tin", en: "Many links in one message" },
    why: {
      vi: "Nhiều link trong một tin nhắn ngắn làm tăng khả năng bạn bấm nhầm vào link độc.",
      en: "A short message packed with links raises the odds that you tap the malicious one.",
    },
    fn: (t) => (t.match(/https?:\/\//g) || []).length >= 3,
  },
];
