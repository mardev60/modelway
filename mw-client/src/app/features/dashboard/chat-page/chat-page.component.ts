import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../services/api.service';
interface Message {
  content: string;
  role: string;
}

@Component({
  selector: 'app-chat-page',
  standalone: false,
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
})
export class ChatPageComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  messageInput: string = '';
  messages: Message[] = [];
  defaultModel: string = 'meta-llama/llama-3.3-70B-instruct';
  selectedModel: string = this.defaultModel;
  isLoading: boolean = false;
  models: string[] = [];

  // Métriques avec valeurs initiales à 0
  metrics = {
    requests: { current: 0, max: 0 },
    tokens: { current: 0, max: 0 },
  };

  constructor(private apiService: ApiService) {
    // Message initial de l'assistant
    this.messages.push({
      role: 'assistant',
      content: "Bonjour! Comment puis-je vous aider aujourd'hui?",
    });
    this.updateQuota(this.defaultModel);
  }

  ngOnInit(): void {
    this.loadModels();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage(): void {
    if (!this.messageInput.trim()) return;

    const userMessage = {
      role: 'user',
      content: this.messageInput,
    };

    this.messages.push(userMessage);
    this.isLoading = true;

    // Appel à l'API avec le bon format
    this.apiService
      .post(
        '/v1/chat/completions',
        {
          model: this.selectedModel,
          messages: [
            {
              role: 'user',
              content: this.messageInput,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${environment.userApiKey}`,
          },
        }
      )
      .subscribe({
        next: (response: any) => {
          this.messages.push({
            role: 'assistant',
            content: response.choices[0].message.content,
          });
        },
        error: (error) => {
          console.error("Erreur lors de l'envoi du message:", error);
          this.messages.push({
            role: 'assistant',
            content:
              "Désolé, une erreur est survenue lors de l'envoi du message.",
          });
        },
      })
      .add(() => {
        this.isLoading = false;
      });

    this.messageInput = '';
  }

  onModelChange() {
    this.defaultModel = this.selectedModel;
    this.updateQuota(this.selectedModel);
  }

  /*
   * Met à jour le quota restant pour un utilisateur pour un modèle dans la métrique "Requests"
   */
  private async updateQuota(modelName: string): Promise<void> {
    const remainingQuota = await this.checkQuota(modelName);
    this.metrics.requests.current = remainingQuota;
  }

  /*
   * Vérifie le quota restant pour un utilisateur pour un modèle
   */
  private async checkQuota(modelName: string): Promise<number> {
    try {
      // Encoder le nom du modèle pour gérer les caractères spéciaux
      const encodedModelName = encodeURIComponent(modelName);
      const response = await firstValueFrom(
        this.apiService.get<{ remaining: number }>(
          `/quotas/check/${encodedModelName}`
        )
      );
      return response.remaining;
    } catch (error) {
      console.error('Erreur lors de la vérification du quota:', error);
      return 0;
    }
  }

  /*
   * Récupère les modèles disponibles afin de les afficher dans le select
   */
  private loadModels(): void {
    this.apiService.get<string[]>('/models/names').subscribe({
      next: (response: string[]) => {
        this.models = response;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des modèles:', error);
        this.models = [this.defaultModel];
      },
    });
  }
}
