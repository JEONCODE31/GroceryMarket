package jb.studio.ground.grocerymarket.mapper;

import jb.studio.ground.grocerymarket.domain.entity.Product;
import jb.studio.ground.grocerymarket.domain.entity.User;
import jb.studio.ground.grocerymarket.dto.auth.user.UserProfileDto; // 이 DTO는 현재 사용되지 않는 것으로 보입니다.
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.web.bind.annotation.RequestParam; // 이 어노테이션은 Mapper 인터페이스에서 사용하지 않습니다.

import java.util.List;

@Mapper
public interface UserMapper {
    @Select("SELECT * FROM Users where userId = #{userId}")
    User selectByUserId(Long userId);
    // 새롭게 추가하는 메서드: 모든 회원 조회
    @Select("SELECT userId, userName, email, createdAt FROM users")
    List<User> findAllUsers();
    // ✨ 이 부분이 잘못되었습니다. 'email ='로 수정해야 합니다.
    @Select("SELECT * FROM Users WHERE email = #{email}") // 수정된 부분
    User selectUserByEmail(String email);

    @Select("SELECT email FROM Users WHERE email = #{email}")
    String selectByEmail(String email);

    void insertUser(User newUser);

    void insertProduct(Product product);
}