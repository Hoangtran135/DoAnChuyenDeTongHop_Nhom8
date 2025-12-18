// AI Assistant Module - Tự động trả lời câu hỏi của khách hàng

// Từ khóa và câu trả lời
const responses = {
  greeting: {
    patterns: ['xin chào', 'chào', 'hello', 'hi', 'hey'],
    responses: [
      'Xin chào! Tôi là AI Assistant của NineMart. Tôi có thể giúp gì cho bạn? 😊',
      'Chào bạn! Rất vui được hỗ trợ bạn. Bạn cần tư vấn gì?',
      'Xin chào! Bạn muốn tìm hiểu về sản phẩm nào?'
    ]
  },
  products: {
    patterns: ['sản phẩm', 'hàng', 'mặt hàng', 'đồ', 'có gì', 'bán gì'],
    responses: [
      'Chúng tôi có rất nhiều sản phẩm đa dạng! Bạn có thể xem danh sách sản phẩm trên trang chủ. Bạn đang tìm sản phẩm gì cụ thể?',
      'NineMart có đầy đủ các mặt hàng thiết yếu. Bạn muốn tìm sản phẩm nào?',
      'Bạn có thể duyệt danh mục sản phẩm trên app. Bạn quan tâm đến sản phẩm nào?'
    ]
  },
  order: {
    patterns: ['đặt hàng', 'mua hàng', 'thêm vào giỏ', 'giỏ hàng', 'checkout'],
    responses: [
      'Để đặt hàng, bạn chỉ cần thêm sản phẩm vào giỏ hàng và thanh toán. Bạn cần hỗ trợ gì thêm?',
      'Bạn có thể thêm sản phẩm vào giỏ hàng và tiến hành đặt hàng. Có câu hỏi gì về quy trình đặt hàng không?',
      'Để mua hàng, hãy chọn sản phẩm và thêm vào giỏ. Tôi có thể giúp bạn tìm sản phẩm!'
    ]
  },
  price: {
    patterns: ['giá', 'giá cả', 'bao nhiêu', 'chi phí', 'phí'],
    responses: [
      'Giá sản phẩm được hiển thị trên từng sản phẩm. Bạn muốn biết giá của sản phẩm nào?',
      'Bạn có thể xem giá chi tiết khi chọn sản phẩm. Bạn quan tâm sản phẩm nào?',
      'Giá cả được cập nhật thường xuyên. Bạn muốn tìm hiểu về sản phẩm nào?'
    ]
  },
  delivery: {
    patterns: ['giao hàng', 'ship', 'vận chuyển', 'nhận hàng', 'thời gian giao'],
    responses: [
      'Chúng tôi giao hàng nhanh chóng và an toàn. Bạn có thể chọn phương thức giao hàng khi đặt hàng.',
      'Thời gian giao hàng tùy thuộc vào địa chỉ của bạn. Bạn muốn biết thêm chi tiết?',
      'Chúng tôi có nhiều phương thức giao hàng. Bạn có thể chọn khi đặt hàng!'
    ]
  },
  payment: {
    patterns: ['thanh toán', 'trả tiền', 'payment', 'tiền', 'phương thức thanh toán'],
    responses: [
      'Chúng tôi hỗ trợ nhiều phương thức thanh toán. Bạn có thể chọn khi đặt hàng.',
      'Bạn có thể thanh toán bằng nhiều cách khác nhau. Bạn muốn biết thêm chi tiết?',
      'Hệ thống hỗ trợ thanh toán linh hoạt. Bạn có thể chọn phương thức phù hợp!'
    ]
  },
  help: {
    patterns: ['giúp', 'hỗ trợ', 'help', 'cần giúp', 'làm sao'],
    responses: [
      'Tôi sẵn sàng giúp bạn! Bạn cần hỗ trợ về điều gì? Sản phẩm, đặt hàng, hay thanh toán?',
      'Tôi có thể giúp bạn tìm sản phẩm, hướng dẫn đặt hàng, hoặc trả lời câu hỏi. Bạn cần gì?',
      'Chúng tôi luôn sẵn sàng hỗ trợ! Bạn muốn biết thêm về điều gì?'
    ]
  },
  thanks: {
    patterns: ['cảm ơn', 'thank', 'thanks', 'cám ơn'],
    responses: [
      'Không có gì! Rất vui được giúp bạn. Nếu cần thêm gì, cứ hỏi nhé! 😊',
      'Rất vui được phục vụ bạn! Chúc bạn mua sắm vui vẻ!',
      'Cảm ơn bạn đã tin tưởng NineMart! Chúc bạn có trải nghiệm tốt!'
    ]
  }
};

// Tìm kiếm sản phẩm trong database
function searchProducts(db, keyword, callback) {
  if (!db) {
    return callback(null, []);
  }
  
  const searchQuery = `
    SELECT id, name, price, images, description 
    FROM products 
    WHERE name LIKE ? OR description LIKE ?
    LIMIT 5
  `;
  
  const searchTerm = `%${keyword}%`;
  db.query(searchQuery, [searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error('AI search error:', err);
      return callback(null, []);
    }
    callback(null, results);
  });
}

// Xử lý tin nhắn và tạo phản hồi AI
function processMessage(db, message, conversationId, callback) {
  const lowerMessage = message.toLowerCase().trim();
  
  // Kiểm tra từ khóa
  for (const [category, data] of Object.entries(responses)) {
    for (const pattern of data.patterns) {
      if (lowerMessage.includes(pattern)) {
        const randomResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
        
        // Nếu là câu hỏi về sản phẩm, tìm kiếm
        if (category === 'products' || lowerMessage.includes('tìm') || lowerMessage.includes('có')) {
          // Tìm từ khóa sản phẩm trong câu
          const productKeywords = extractProductKeywords(lowerMessage);
          if (productKeywords.length > 0) {
            searchProducts(db, productKeywords[0], (err, products) => {
              if (products && products.length > 0) {
                let productList = 'Tôi tìm thấy một số sản phẩm:\n';
                products.forEach((p, idx) => {
                  productList += `${idx + 1}. ${p.name} - ${p.price.toLocaleString('vi-VN')}đ\n`;
                });
                productList += '\nBạn có thể xem chi tiết trên app!';
                return callback(productList);
              } else {
                return callback(randomResponse);
              }
            });
            return;
          }
        }
        
        return callback(randomResponse);
      }
    }
  }
  
  // Nếu không khớp pattern, trả lời mặc định
  const defaultResponses = [
    'Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về sản phẩm, đặt hàng, hoặc thanh toán. Tôi sẽ cố gắng giúp bạn!',
    'Tôi có thể giúp bạn tìm sản phẩm, hướng dẫn đặt hàng, hoặc trả lời câu hỏi. Bạn muốn biết gì?',
    'Bạn có thể hỏi tôi về sản phẩm, cách đặt hàng, hoặc bất kỳ điều gì về NineMart. Tôi sẵn sàng giúp!'
  ];
  
  const defaultResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  callback(defaultResponse);
}

// Trích xuất từ khóa sản phẩm từ câu
function extractProductKeywords(message) {
  const stopWords = ['tìm', 'có', 'bán', 'mua', 'sản phẩm', 'hàng', 'gì', 'nào', 'cho', 'tôi', 'bạn'];
  const words = message.split(/\s+/).filter(word => 
    word.length > 2 && !stopWords.includes(word)
  );
  return words.slice(0, 2); // Lấy 2 từ đầu tiên
}

// Gửi phản hồi AI vào conversation
function sendAIResponse(dbConnection, conversationId, message) {
  processMessage(dbConnection, message, conversationId, (aiResponse) => {
    const adminId = 1; // AI Assistant ID
    const role = 1; // Admin role
    
    // Delay 1-2 giây để trả lời tự nhiên hơn
    setTimeout(() => {
      dbConnection.query(
        "INSERT INTO messages (conversation_id, user_id, message, role, created_at) VALUES (?, ?, ?, ?, NOW())",
        [conversationId, adminId, `🤖 AI: ${aiResponse}`, role],
        (err) => {
          if (err) {
            console.error('AI response error:', err);
          } else {
            console.log('AI response sent:', aiResponse);
          }
        }
      );
    }, 1000 + Math.random() * 1000); // 1-2 giây
  });
}

module.exports = {
  processMessage,
  sendAIResponse,
  searchProducts
};

