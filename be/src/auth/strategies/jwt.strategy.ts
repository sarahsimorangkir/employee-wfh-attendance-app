import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        config.get<string>('JWT_SECRET') ||
        process.env.JWT_SECRET ||
        's3cr3t_jwt_k3y_f0r_wfh_att3ndanc3_app_2026',
    });
  }

  async validate(payload: { sub: number; role: string; email: string }) {
    return payload; // attached to req.user
  }
}
