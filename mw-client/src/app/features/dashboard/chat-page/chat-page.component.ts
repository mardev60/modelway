import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
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
  hasQuota: boolean = true;
  isLoadingModels: boolean = false;

  // Métriques avec valeurs initiales à 0
  metrics = {
    requests: { current: 0, max: 0 },
    tokens: { current: 0, max: 0 },
  };

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    this.loadModels();
    await this.updateQuota(this.selectedModel);
    this.messages.push(this.getWelcomeMessage()); // Déplacé ici après la vérification du quota
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

  /**
   * Envoie un message à l'assistant
   */
  sendMessage(): void {
    if (!this.messageInput.trim() || !this.hasQuota) return;

    const userMessage = {
      role: 'user',
      content: this.messageInput,
    };

    this.messages.push(userMessage);
    this.isLoading = true;

    // Appel à l'API avec le bon format
    this.apiService
      .post('/v1/chat/completions/test', {
        model: this.selectedModel,
        messages: [
          {
            role: 'user',
            content: this.messageInput,
          },
        ],
      })
      .subscribe({
        next: async (response: any) => {
          this.messages.push({
            role: 'assistant',
            content: response.choices[0].message.content,
          });
          // Mise à jour du quota après chaque requête réussie
          await this.updateQuota(this.selectedModel);
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

  /**
   * Met à jour le modèle sélectionné et met à jour le quota
   */
  async onModelChange() {
    this.defaultModel = this.selectedModel;
    await this.updateQuota(this.selectedModel);
    this.messages = [this.getWelcomeMessage()];
  }

  /*
   * Met à jour le quota restant pour un utilisateur pour un modèle dans la métrique "Requests"
   */
  private async updateQuota(modelName: string): Promise<void> {
    const remainingQuota = await this.checkQuota(modelName);
    this.metrics.requests.current = remainingQuota;
    this.hasQuota = remainingQuota > 0;
  }

  /*
   * Vérifie le quota restant pour un utilisateur pour un modèle
   * Encode le nom du modèle pour gérer les caractères spéciaux
   * @param modelName - Le nom du modèle à vérifier
   * @returns Le quota restant pour le modèle
   * @throws Erreur si le quota ne peut pas être vérifié
   */
  private async checkQuota(modelName: string): Promise<number> {
    try {
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
    this.isLoadingModels = true;
    this.apiService.get<string[]>('/models/names').subscribe({
      next: (response: string[]) => {
        this.models = response;
        this.isLoadingModels = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des modèles:', error);
        this.models = [this.defaultModel];
        this.isLoadingModels = false;
      },
    });
  }

  private getWelcomeMessage(): Message {
    return this.hasQuota
      ? {
          role: 'assistant',
          content: 'Hello! How can I help you today?',
        }
      : {
          role: 'assistant',
          content: 'Sorry, you have reached your quota limit.',
        };
  }
}
