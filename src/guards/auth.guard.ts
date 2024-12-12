import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "src/modules/user/services/user.service";

/**
 * Guard de autenticación de las películas
 * @author Santiago Ruiz - santiago.develops@gmail.com
 * @copyright Psycotick Software S.L.
 * @license MIT
 */

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.userService.validateRequest(request);
  }
}
