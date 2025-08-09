package jb.studio.ground.grocerymarket.controller;

import jakarta.validation.Valid;
import jb.studio.ground.grocerymarket.domain.entity.User;
import jb.studio.ground.grocerymarket.dto.auth.JwtAuthenticationResponse;
import jb.studio.ground.grocerymarket.dto.auth.LoginRequest;
import jb.studio.ground.grocerymarket.mapper.UserMapper;
import jb.studio.ground.grocerymarket.service.UserLoginService;
import jb.studio.ground.grocerymarket.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class LoginController {

   private final UserMapper userMapper;
   private final PasswordEncoder passwordEncoder;
   private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
public ResponseEntity<JwtAuthenticationResponse> login(@Valid @RequestBody LoginRequest request) {

        String email = request.getEmail();
        String password = request.getPassword();

        User user = userMapper. selectUserByEmail(email);
        if(user == null || ! passwordEncoder.matches(password, user.getPassword()) ) {
            return ResponseEntity.badRequest().build();
        }
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getUserType());
        JwtAuthenticationResponse response = new JwtAuthenticationResponse(token);
        return ResponseEntity.ok(response);
    }



}
